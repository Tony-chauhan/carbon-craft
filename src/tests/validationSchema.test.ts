import { describe, it, expect } from 'vitest';
import { assessmentSchema } from '../utils/validationSchema';

describe('Validation Schema', () => {
  it('validates a correct payload', () => {
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
      transport: 'spaceship', // invalid
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
});
