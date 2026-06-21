import type { ScoreResult, CategoryBreakdown } from './scoringLogic';

export type ImpactDiff = {
  improvementAmount: number;
  isImprovement: boolean;
  improvedCategories: string[];
  worsenedCategories: string[];
  summary: string;
};

/**
 * Calculates the difference between two carbon footprint scores (e.g., actual vs. simulated).
 * @param oldScore The baseline score result.
 * @param newScore The new simulated or updated score result.
 * @returns An ImpactDiff object summarizing improvements or regressions.
 */
export function calculateImpactDiff(oldScore: ScoreResult, newScore: ScoreResult): ImpactDiff {
  const diff = oldScore.total - newScore.total;
  const isImprovement = diff > 0;
  
  const improved: string[] = [];
  const worsened: string[] = [];
  
  const categories: Array<keyof CategoryBreakdown> = ['transport', 'homeEnergy', 'diet', 'shopping', 'waste', 'flights'];
  
  categories.forEach(cat => {
    const catDiff = oldScore.breakdown[cat] - newScore.breakdown[cat];
    if (catDiff > 0) improved.push(cat);
    if (catDiff < 0) worsened.push(cat);
  });
  
  let summary: string;
  if (isImprovement) {
    summary = `Awesome! You reduced your footprint by ${diff} kg CO2e. Keep it up!`;
  } else if (diff < 0) {
    summary = `Your footprint increased by ${Math.abs(diff)} kg CO2e. Check your recommendations to get back on track.`;
  } else {
    summary = `Your footprint is exactly the same.`;
  }
  
  return {
    improvementAmount: Math.abs(diff),
    isImprovement,
    improvedCategories: improved,
    worsenedCategories: worsened,
    summary
  };
}
