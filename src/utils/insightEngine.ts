import type { ScoreResult, CategoryBreakdown } from './scoringLogic';

/**
 * Analyzes the carbon score to provide a human-readable AI insight.
 * @param score The calculated score result.
 * @returns A personalized insight string identifying the top emission source and a suggested action.
 */
export function generateInsight(score: ScoreResult): string {
  const topCategory = score.highestContributor;
  const percentage = Math.round((score.breakdown[topCategory] / score.total) * 100);

  const categoryNames: Record<keyof CategoryBreakdown, string> = {
    transport: 'Transport',
    homeEnergy: 'Home Energy',
    diet: 'Diet',
    shopping: 'Shopping',
    waste: 'Waste',
    flights: 'Flights'
  };

  const name = categoryNames[topCategory];

  let action = '';
  switch (topCategory) {
    case 'transport': action = 'Switching to public transit or carpooling could drastically reduce this.'; break;
    case 'homeEnergy': action = 'Switching to a green energy plan is the fastest way to drop this.'; break;
    case 'diet': action = 'Eating fewer animal products can shrink this portion significantly.'; break;
    case 'shopping': action = 'Buying second-hand or reducing consumption is key here.'; break;
    case 'waste': action = 'Composting and recycling more can help lower this impact.'; break;
    case 'flights': action = 'Taking fewer flights is the single most effective change you can make.'; break;
  }

  return `${name} contributes ${percentage}% of your footprint. ${action}`;
}
