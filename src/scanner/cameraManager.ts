import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import {
  computeLaplacianSharpness,
  computeZoomCropRect,
  rgbaToGrayscale
} from './imagePreprocessor';

export type CameraPermissionState =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'unavailable';

export interface FocusStatus {
  mode: 'continuous' | 'single-shot' | 'software' | 'refocusing';
  sharpness: number;
  isSharp: boolean;
}

export interface SnapshotCaptureResult {
  dataUrl: string;
  width: number;
  height: number;
  zoomApplied: number;
}

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  focusMode?: string[];
  pointsOfInterest?: boolean;
  torch?: boolean;
  zoom?: { min?: number; max?: number; step?: number };
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  focusMode?: string;
  pointsOfInterest?: Array<{ x: number; y: number }>;
  torch?: boolean;
  zoom?: number;
}

export interface CameraManagerCallbacks {
  onPermissionChange?: (state: CameraPermissionState, reason?: string) => void;
  onFocusStatus?: (status: FocusStatus) => void;
  onZoomChange?: (zoom: number, hardwareSupported: boolean) => void;
  onStreamReady?: (stream: MediaStream, hasContinuousAf: boolean, hasTorch: boolean) => void;
  onError?: (message: string) => void;
}

/**
 * In-App Live Camera Viewfinder, Digital Zoom, Continuous Auto-Focus & Snapshot Capture Manager.
 * Uses HTML5 MediaStream (navigator.mediaDevices.getUserMedia with facingMode: 'environment')
 * and native Capacitor camera permission checks — never opens external gallery or file pickers.
 */
export class OfflineCameraManager {
  private stream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private flashEnabled = false;
  private zoomLevel = 1.0;
  private hardwareZoomApplied = 1.0;
  private softwareZoomScale = 1.0;
  private permissionState: CameraPermissionState = 'idle';
  private focusTimer: number | null = null;
  private monitorCanvas: HTMLCanvasElement | null = null;
  private callbacks: CameraManagerCallbacks = {};
  private lastRefocusTimestamp = 0;

  setCallbacks(callbacks: CameraManagerCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  getPermissionState(): CameraPermissionState {
    return this.permissionState;
  }

  getZoom(): number {
    return this.zoomLevel;
  }

  isStreaming(): boolean {
    return Boolean(this.stream && this.videoTrack && this.videoTrack.readyState === 'live');
  }

  /**
   * Check and smoothly request in-app camera permission across Capacitor Native & Browser WebView.
   */
  async ensureCameraPermission(): Promise<boolean> {
    this.permissionState = 'checking';
    this.callbacks.onPermissionChange?.('checking');

    if (Capacitor.isNativePlatform()) {
      try {
        const current = await Camera.checkPermissions();
        if (current.camera === 'granted') {
          this.permissionState = 'granted';
          this.callbacks.onPermissionChange?.('granted');
          return true;
        }
        const requested = await Camera.requestPermissions({
          permissions: ['camera']
        });
        if (requested.camera === 'granted') {
          this.permissionState = 'granted';
          this.callbacks.onPermissionChange?.('granted');
          return true;
        }
        this.permissionState = 'denied';
        this.callbacks.onPermissionChange?.(
          'denied',
          'Camera permission is required to scan equations directly in the viewfinder.'
        );
        return false;
      } catch (err) {
        console.warn('Capacitor camera permission check:', err);
      }
    }

    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      try {
        const perm = await navigator.permissions.query({
          name: 'camera' as PermissionName
        });
        if (perm.state === 'denied') {
          this.permissionState = 'denied';
          this.callbacks.onPermissionChange?.(
            'denied',
            'Camera access is blocked. Please allow camera permission and tap Retry.'
          );
          return false;
        }
      } catch {
        // Ignore browsers where permissions.query('camera') is unsupported
      }
    }

    this.permissionState = 'granted';
    this.callbacks.onPermissionChange?.('granted');
    return true;
  }

  /**
   * Start in-app HTML5 live camera stream targeting back camera (facingMode: 'environment')
   * and render directly inside the provided <video> element with playsInline and autoPlay enabled.
   */
  async startLivePreview(videoElement: HTMLVideoElement | null): Promise<boolean> {
    this.stopLivePreview();
    this.videoEl = videoElement;
    this.zoomLevel = 1.0;
    this.hardwareZoomApplied = 1.0;
    this.softwareZoomScale = 1.0;

    if (videoElement) {
      videoElement.playsInline = true;
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('autoplay', 'true');
      videoElement.setAttribute('muted', 'true');
      videoElement.style.transform = 'scale(1)';
      videoElement.style.transformOrigin = 'center center';
    }

    const hasPerm = await this.ensureCameraPermission();
    if (!hasPerm) {
      return false;
    }

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      this.permissionState = 'unavailable';
      this.callbacks.onPermissionChange?.(
        'unavailable',
        'In-app camera stream is unavailable on this browser or WebView. Tap Retry to try again.'
      );
      return false;
    }

    try {
      const primaryConstraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
        },
        audio: false
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
      } catch {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
      }

      const tracks = this.stream.getVideoTracks();
      this.videoTrack = tracks[0] || null;

      if (videoElement) {
        videoElement.srcObject = this.stream;
        videoElement.playsInline = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.setAttribute('playsinline', 'true');
        videoElement.setAttribute('autoplay', 'true');
        videoElement.setAttribute('muted', 'true');
        videoElement.classList.remove('hidden');
        try {
          await videoElement.play();
        } catch {
          // Autoplay promise handled via muted/playsInline
        }
      }

      const { hasContinuousAf, hasTorch } = await this.configureContinuousAutoFocus();
      this.permissionState = 'granted';
      this.callbacks.onPermissionChange?.('granted');
      this.callbacks.onZoomChange?.(1.0, false);
      this.callbacks.onStreamReady?.(this.stream, hasContinuousAf, hasTorch);

      this.startFocusMonitor();
      return true;
    } catch (err: any) {
      const name = err?.name || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
        this.permissionState = 'denied';
        this.callbacks.onPermissionChange?.(
          'denied',
          'Camera permission was denied. Grant access in your device settings and tap Retry Camera.'
        );
      } else {
        this.permissionState = 'unavailable';
        this.callbacks.onPermissionChange?.(
          'unavailable',
          'Unable to start back camera stream. Ensure no other app is using the camera and tap Retry.'
        );
      }
      return false;
    }
  }

  /**
   * Configure hardware continuous autofocus on the active MediaStreamTrack when supported.
   */
  async configureContinuousAutoFocus(): Promise<{ hasContinuousAf: boolean; hasTorch: boolean }> {
    if (!this.videoTrack || typeof this.videoTrack.getCapabilities !== 'function') {
      return { hasContinuousAf: false, hasTorch: false };
    }

    try {
      const caps = this.videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      const hasTorch = Boolean(caps.torch);
      const supportedFocus = Array.isArray(caps.focusMode) ? caps.focusMode : [];
      const hasContinuousAf = supportedFocus.includes('continuous');

      if (hasContinuousAf) {
        await this.videoTrack.applyConstraints({
          advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
        });
        this.callbacks.onFocusStatus?.({
          mode: 'continuous',
          sharpness: 100,
          isSharp: true
        });
      } else {
        this.callbacks.onFocusStatus?.({
          mode: 'software',
          sharpness: 100,
          isSharp: true
        });
      }

      return { hasContinuousAf, hasTorch };
    } catch {
      return { hasContinuousAf: false, hasTorch: false };
    }
  }

  /**
   * Set digital zoom level (1.0x .. 4.0x) to focus on small or distant handwritten math.
   * Combines hardware track zoom when supported with smooth CSS preview + canvas capture crop zoom.
   */
  async setDigitalZoom(requestedZoom: number): Promise<number> {
    const clampedZoom = Math.max(
      1.0,
      Math.min(4.0, Math.round((Number(requestedZoom) || 1.0) * 10) / 10)
    );
    this.zoomLevel = clampedZoom;

    let appliedHardware = 1.0;
    let hardwareSupported = false;

    if (this.videoTrack && typeof this.videoTrack.getCapabilities === 'function') {
      try {
        const caps = this.videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
        if (caps.zoom && typeof caps.zoom.max === 'number' && caps.zoom.max > 1) {
          hardwareSupported = true;
          const minHw = typeof caps.zoom.min === 'number' ? caps.zoom.min : 1;
          const maxHw = caps.zoom.max;
          const targetHw = Math.max(minHw, Math.min(maxHw, clampedZoom));
          await this.videoTrack.applyConstraints({
            advanced: [{ zoom: targetHw } as ExtendedMediaTrackConstraintSet]
          });
          appliedHardware = targetHw;
        }
      } catch {
        appliedHardware = 1.0;
        hardwareSupported = false;
      }
    }

    this.hardwareZoomApplied = appliedHardware;
    this.softwareZoomScale = Math.max(1.0, clampedZoom / appliedHardware);

    if (this.videoEl) {
      this.videoEl.style.transformOrigin = 'center center';
      this.videoEl.style.transform = `scale(${this.softwareZoomScale.toFixed(3)})`;
    }

    this.callbacks.onZoomChange?.(clampedZoom, hardwareSupported);
    return clampedZoom;
  }

  /**
   * Trigger active autofocus lock at normalized viewfinder coordinates (x, y in 0..1).
   */
  async refocusAt(normX = 0.5, normY = 0.5): Promise<void> {
    if (!this.videoTrack || typeof this.videoTrack.getCapabilities !== 'function') return;
    const now = Date.now();
    if (now - this.lastRefocusTimestamp < 450) return;
    this.lastRefocusTimestamp = now;

    try {
      const caps = this.videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      const supportedFocus = Array.isArray(caps.focusMode) ? caps.focusMode : [];
      const constraint: ExtendedMediaTrackConstraintSet = {};

      if (caps.pointsOfInterest) {
        constraint.pointsOfInterest = [
          {
            x: Math.max(0.05, Math.min(0.95, normX)),
            y: Math.max(0.05, Math.min(0.95, normY))
          }
        ];
      }

      this.callbacks.onFocusStatus?.({
        mode: 'refocusing',
        sharpness: 0,
        isSharp: false
      });

      if (supportedFocus.includes('single-shot')) {
        constraint.focusMode = 'single-shot';
        await this.videoTrack.applyConstraints({ advanced: [constraint] });
        setTimeout(async () => {
          if (this.videoTrack && supportedFocus.includes('continuous')) {
            try {
              await this.videoTrack.applyConstraints({
                advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
              });
            } catch {
              // Ignore if track stopped
            }
          }
        }, 650);
      } else if (supportedFocus.includes('continuous')) {
        constraint.focusMode = 'continuous';
        await this.videoTrack.applyConstraints({ advanced: [constraint] });
      }
    } catch {
      // Driver rejected manual refocus
    }
  }

  private startFocusMonitor(): void {
    this.stopFocusMonitor();
    if (typeof window === 'undefined' || !this.videoEl) return;

    if (!this.monitorCanvas) {
      this.monitorCanvas = document.createElement('canvas');
      this.monitorCanvas.width = 240;
      this.monitorCanvas.height = 180;
    }

    this.focusTimer = window.setInterval(() => {
      if (!this.videoEl || !this.isStreaming() || this.videoEl.videoWidth === 0) return;
      const ctx = this.monitorCanvas?.getContext('2d', { willReadFrequently: true });
      if (!ctx || !this.monitorCanvas) return;

      const vw = this.videoEl.videoWidth;
      const vh = this.videoEl.videoHeight;
      const zoomCrop = computeZoomCropRect(vw, vh, this.softwareZoomScale);
      const sx = zoomCrop.sx + Math.floor(zoomCrop.sw * 0.2);
      const sy = zoomCrop.sy + Math.floor(zoomCrop.sh * 0.25);
      const sw = Math.max(16, Math.floor(zoomCrop.sw * 0.6));
      const sh = Math.max(16, Math.floor(zoomCrop.sh * 0.5));

      ctx.drawImage(this.videoEl, sx, sy, sw, sh, 0, 0, 240, 180);
      const data = ctx.getImageData(0, 0, 240, 180).data;
      const gray = rgbaToGrayscale(data, 240, 180);
      const sharpness = computeLaplacianSharpness(gray, 240, 180);
      const isSharp = sharpness >= 35;

      this.callbacks.onFocusStatus?.({
        mode: 'continuous',
        sharpness,
        isSharp
      });

      if (!isSharp && Date.now() - this.lastRefocusTimestamp > 2800) {
        this.refocusAt(0.5, 0.5);
      }
    }, 1100);
  }

  private stopFocusMonitor(): void {
    if (this.focusTimer !== null) {
      clearInterval(this.focusTimer);
      this.focusTimer = null;
    }
  }

  async toggleTorch(): Promise<boolean> {
    if (!this.videoTrack || typeof this.videoTrack.getCapabilities !== 'function') {
      return false;
    }
    try {
      const caps = this.videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      if (!caps.torch) return false;
      this.flashEnabled = !this.flashEnabled;
      await this.videoTrack.applyConstraints({
        advanced: [{ torch: this.flashEnabled } as ExtendedMediaTrackConstraintSet]
      });
      return this.flashEnabled;
    } catch {
      this.flashEnabled = false;
      return false;
    }
  }

  /**
   * Capture current frame from live <video> onto an HTML5 <canvas> (with active digital zoom crop),
   * convert to PNG data URL (image/png), and immediately stop active camera media tracks to release hardware.
   */
  captureSnapshotDataUrl(): SnapshotCaptureResult | null {
    if (!this.videoEl || !this.isStreaming() || this.videoEl.videoWidth === 0) {
      return null;
    }

    const vw = this.videoEl.videoWidth;
    const vh = this.videoEl.videoHeight;
    const zoomApplied = this.zoomLevel;
    const crop = computeZoomCropRect(vw, vh, this.softwareZoomScale);

    const canvas = document.createElement('canvas');
    canvas.width = crop.sw;
    canvas.height = crop.sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      this.videoEl,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      0,
      0,
      crop.sw,
      crop.sh
    );

    const dataUrl = canvas.toDataURL('image/png');

    // Immediately stop active camera media tracks to release hardware
    this.stopLivePreview();

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      zoomApplied
    };
  }

  /**
   * Stop all active camera media tracks immediately and detach video stream.
   */
  stopLivePreview(): void {
    this.stopFocusMonitor();
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors
        }
      });
      this.stream = null;
    }
    if (this.videoEl) {
      try {
        this.videoEl.srcObject = null;
      } catch {
        // Ignore cleanup errors
      }
    }
    this.videoTrack = null;
    this.flashEnabled = false;
  }
}

export const sharedCameraManager = new OfflineCameraManager();
