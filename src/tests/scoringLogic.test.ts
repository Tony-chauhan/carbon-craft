import { describe, it, expect } from 'vitest';
import { calculateScore } from '../utils/scoringLogic';
import type { AssessmentData } from '../utils/validationSchema';

describe('Scoring Logic', () => {
  it('calculates a vegan, public-transit low footprint correctly', () => {
    const data: AssessmentData = {
      transport: 'public',
      homeEnergy: 'renewable',
      energyUsage: 300,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    
    const score = calculateScore(data);
    expect(score.total).toBeLessThan(200); // 50(transport) + 15(homeEnergy) + 50(diet) + 50(shopping) + 20(waste) + 0(flights) = 185
    expect(score.breakdown.transport).toBe(50);
  });

  it('calculates a high-emission lifestyle correctly', () => {
    const data: AssessmentData = {
      transport: 'car',
      carUsage: 500, // 200 + 500*0.4 = 400
      homeEnergy: 'fossil',
      energyUsage: 1000, // 1000*0.5 = 500
      diet: 'meat-heavy', // 300
      shopping: 'frequent', // 200
      waste: 'high', // 100
      flights: 5 // 5*250 = 1250
    };

    const score = calculateScore(data);
    expect(score.total).toBe(400 + 500 + 300 + 200 + 100 + 1250); // 2750
    expect(score.highestContributor).toBe('flights');
  });

  it('identifies the highest contributor dynamically', () => {
    const data: AssessmentData = {
      transport: 'public',
      homeEnergy: 'mixed',
      energyUsage: 500, // 500*0.5*0.7 = 175
      diet: 'meat-heavy', // 300
      shopping: 'average',
      waste: 'average',
      flights: 0
    };

    const score = calculateScore(data);
    expect(score.highestContributor).toBe('diet');
  });
});
