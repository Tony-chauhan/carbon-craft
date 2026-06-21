import { describe, it, expect } from 'vitest';
import { assessmentSchema } from '../utils/validationSchema';

describe('Validation Schema Boundary and Edge Cases', () => {
  it('validates a correct payload at nominal values', () => {
    const validData = {
      transport: 'car',
      carUsage: 100,
      homeEnergy: 'renewable',
      energyUsage: 500,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    const result = assessmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid enums', () => {
    const invalidData = {
      transport: 'spaceship', // invalid enum
      carUsage: 100,
      homeEnergy: 'renewable',
      energyUsage: 500,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    const result = assessmentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects negative numeric boundaries', () => {
    const negativeData = {
      transport: 'bike',
      carUsage: -5, // boundary violation (< 0)
      homeEnergy: 'renewable',
      energyUsage: 500,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    const result = assessmentSchema.safeParse(negativeData);
    expect(result.success).toBe(false);
  });

  it('rejects values exceeding maximum boundaries', () => {
    const excessiveData = {
      transport: 'car',
      carUsage: 1001, // boundary violation (> 1000)
      homeEnergy: 'renewable',
      energyUsage: 5001, // boundary violation (> 5000)
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 51 // boundary violation (> 50)
    };
    const result = assessmentSchema.safeParse(excessiveData);
    expect(result.success).toBe(false);
  });

  it('accepts boundary edge values (min/max exact limits)', () => {
    const boundaryData = {
      transport: 'walk',
      carUsage: 1000, // max limit
      homeEnergy: 'fossil',
      energyUsage: 5000, // max limit
      diet: 'meat-heavy',
      shopping: 'second-hand',
      waste: 'zero-waste',
      flights: 50 // max limit
    };
    const result = assessmentSchema.safeParse(boundaryData);
    expect(result.success).toBe(true);
  });

  it('rejects empty payload objects or missing required fields', () => {
    const incompleteData = {
      transport: 'walk',
      // missing energyUsage, diet, shopping, waste, flights
    };
    const result = assessmentSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);
  });
});
