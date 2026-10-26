import { describe, it, expect } from 'vitest';
import { Solver } from '../src/solver';

describe('MathSolver Core Logic Tests', () => {
  describe('Basic Algebraic Equations', () => {
    it('solves simple linear equation: 2x + 5 = 15', async () => {
      const res = await Solver.solve('2x + 5 = 15');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('x = 5');
      expect(res.steps.length).toBeGreaterThan(0);
    });

    it('solves linear equation with subtraction: 3x - 9 = 0', async () => {
      const res = await Solver.solve('3x - 9 = 0');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('x = 3');
    });

    it('solves quadratic equation: x^2 - 5x + 6 = 0', async () => {
      const res = await Solver.solve('x^2 - 5x + 6 = 0');
      expect(res.error).toBeFalsy();
      expect(res.answer).toContain('x = 2');
      expect(res.answer).toContain('x = 3');
    });

    it('solves difference of squares quadratic: x^2 - 16 = 0', async () => {
      const res = await Solver.solve('x^2 - 16 = 0');
      expect(res.error).toBeFalsy();
      expect(res.answer).toContain('-4');
      expect(res.answer).toContain('4');
    });

    it('solves simultaneous linear equations with Division & Factorization methods', async () => {
      const res = await Solver.solve('2x + y = 10, x - y = 2');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('x = 4, y = 2');
      expect(res.systemMethods).toBeDefined();
      expect(res.systemMethods?.cramer?.length).toBeGreaterThan(0);
      expect(res.systemMethods?.factorization?.length).toBeGreaterThan(0);
    });
  });

  describe('Trigonometry Functions', () => {
    it('evaluates sin(30 degrees) to 0.5', async () => {
      const res = await Solver.solve('sin(30)');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('0.5');
    });

    it('evaluates cos(60 degrees) to 0.5', async () => {
      const res = await Solver.solve('cos(60)');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('0.5');
    });

    it('evaluates tan(45 degrees) to 1', async () => {
      const res = await Solver.solve('tan(45)');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('1');
    });

    it('evaluates sin(90 degrees) to 1', async () => {
      const res = await Solver.solve('sin(90)');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('1');
    });
  });

  describe('Arithmetic and Polynomial Simplifications', () => {
    it('evaluates PEMDAS order of operations: 2 + 3 * 4', async () => {
      const res = await Solver.solve('2 + 3 * 4');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('14');
    });

    it('simplifies algebraic polynomial: 3x + 2x', async () => {
      const res = await Solver.solve('3x + 2x');
      expect(res.error).toBeFalsy();
      expect(res.answer).toBe('5x');
    });
  });
});
