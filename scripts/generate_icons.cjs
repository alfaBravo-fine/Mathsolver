const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.resolve(__dirname, '../public/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Ensure destination directories exist
const dirs = [
  path.resolve(__dirname, '../public/icons'),
  path.resolve(__dirname, '../icons'),
  path.resolve(__dirname, '../public/vendor')
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Also copy icon.svg to public/vendor/icon.svg
fs.writeFileSync(path.resolve(__dirname, '../public/vendor/icon.svg'), svgContent, 'utf8');
console.log('Synchronized public/vendor/icon.svg');

const targets = [
  { file: path.resolve(__dirname, '../public/icons/icon-512.png'), size: 512 },
  { file: path.resolve(__dirname, '../icons/icon-512.png'), size: 512 },
  { file: path.resolve(__dirname, '../public/icons/icon-192.png'), size: 192 },
  { file: path.resolve(__dirname, '../icons/icon-192.png'), size: 192 },
  { file: path.resolve(__dirname, '../public/apple-touch-icon.png'), size: 180 },
  { file: path.resolve(__dirname, '../apple-touch-icon.png'), size: 180 }
];

targets.forEach(({ file, size }) => {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: size
    }
  });
  const pngData = resvg.render().asPng();
  fs.writeFileSync(file, pngData);
  console.log(`Generated ${file} (${size}x${size}, ${pngData.length} bytes)`);
});

console.log('All icons successfully created matching public/vendor/icon.svg!');
