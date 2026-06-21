import { describe, it, expect } from 'vitest';
import { generateInsight } from '../utils/insightEngine';
import type { ScoreResult } from '../utils/scoringLogic';

describe('Insight Engine', () => {
  it('generates correct insight for transport', () => {
    const mockScore: ScoreResult = {
      total: 1000,
      breakdown: { transport: 500, homeEnergy: 100, diet: 100, shopping: 100, waste: 100, flights: 100 },
      highestContributor: 'transport'
    };
    const insight = generateInsight(mockScore);
    expect(insight).toContain('Transport contributes 50%');
    expect(insight).toContain('public transit or carpooling');
  });

  it('generates correct insight for homeEnergy', () => {
    const mockScore: ScoreResult = {
      total: 1000,
      breakdown: { transport: 100, homeEnergy: 800, diet: 20, shopping: 20, waste: 20, flights: 40 },
      highestContributor: 'homeEnergy'
    };
    const insight = generateInsight(mockScore);
    expect(insight).toContain('Home Energy contributes 80%');
    expect(insight).toContain('green energy plan');
  });
});
