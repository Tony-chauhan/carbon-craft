import { describe, it, expect } from 'vitest';
import { calculateImpactDiff } from '../utils/impactDiff';
import type { ScoreResult } from '../utils/scoringLogic';

describe('Impact Diff Logic', () => {
  it('identifies improvements correctly', () => {
    const oldScore: ScoreResult = {
      total: 2000,
      breakdown: { transport: 1000, homeEnergy: 500, diet: 300, shopping: 100, waste: 100, flights: 0 },
      highestContributor: 'transport'
    };
    const newScore: ScoreResult = {
      total: 1500,
      breakdown: { transport: 500, homeEnergy: 500, diet: 300, shopping: 100, waste: 100, flights: 0 },
      highestContributor: 'transport'
    };
    
    const diff = calculateImpactDiff(oldScore, newScore);
    expect(diff.isImprovement).toBe(true);
    expect(diff.improvementAmount).toBe(500);
    expect(diff.improvedCategories).toContain('transport');
    expect(diff.worsenedCategories.length).toBe(0);
    expect(diff.summary).toContain('Awesome!');
  });
  
  it('identifies regressions correctly', () => {
    const oldScore: ScoreResult = {
      total: 1000, breakdown: { transport: 100, homeEnergy: 100, diet: 100, shopping: 100, waste: 100, flights: 500 }, highestContributor: 'flights'
    };
    const newScore: ScoreResult = {
      total: 1500, breakdown: { transport: 100, homeEnergy: 100, diet: 100, shopping: 100, waste: 100, flights: 1000 }, highestContributor: 'flights'
    };
    
    const diff = calculateImpactDiff(oldScore, newScore);
    expect(diff.isImprovement).toBe(false);
    expect(diff.improvementAmount).toBe(500);
    expect(diff.improvedCategories.length).toBe(0);
    expect(diff.worsenedCategories).toContain('flights');
  });
});
