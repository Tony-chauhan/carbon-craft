import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../utils/recommendationsLogic';
import { calculateScore } from '../utils/scoringLogic';
import type { AssessmentData } from '../utils/validationSchema';

describe('Recommendations Logic', () => {
  it('generates high impact recommendations for top contributor', () => {
    const data: AssessmentData = {
      transport: 'car',
      carUsage: 1000, // Very high
      homeEnergy: 'renewable',
      energyUsage: 100,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    
    const score = calculateScore(data);
    const recs = generateRecommendations(data, score);
    
    // Top contributor is transport, so we expect the EV/E-Bike recommendation
    const highImpact = recs.find(r => r.impact === 'high');
    expect(highImpact).toBeDefined();
    expect(highImpact?.title).toContain('EV');
  });

  it('suggests meatless mondays for meat-heavy diets', () => {
    const data: AssessmentData = {
      transport: 'public',
      homeEnergy: 'renewable',
      energyUsage: 100,
      diet: 'meat-heavy',
      shopping: 'rare',
      waste: 'low',
      flights: 0
    };
    
    const score = calculateScore(data);
    const recs = generateRecommendations(data, score);
    
    const weeklyHabit = recs.find(r => r.title === 'Meatless Mondays');
    expect(weeklyHabit).toBeDefined();
  });
});
