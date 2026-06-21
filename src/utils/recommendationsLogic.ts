import type { AssessmentData } from './validationSchema';
import type { ScoreResult } from './scoringLogic';

export type Recommendation = {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  type: 'quick-win' | 'weekly-habit' | 'deep-impact';
};

/**
 * Generates personalized lifestyle recommendations based on the user's assessment data.
 * @param data The user's submitted lifestyle data.
 * @param score The calculated score result containing the highest contributor.
 * @returns An array of actionable recommendations to reduce carbon footprint.
 */
export function generateRecommendations(data: AssessmentData, score: ScoreResult): Recommendation[] {
  const recs: Recommendation[] = [];

  // Quick Wins
  if (data.homeEnergy !== 'renewable') {
    recs.push({
      title: 'Switch to LED Bulbs',
      description: 'Replace top 5 most used bulbs with LEDs to save energy instantly.',
      impact: 'low',
      type: 'quick-win'
    });
  }
  if (data.shopping === 'frequent' || data.shopping === 'average') {
    recs.push({
      title: 'Wait 48 Hours',
      description: 'Implement a 48-hour cooling off period before non-essential purchases.',
      impact: 'low',
      type: 'quick-win'
    });
  }

  // Weekly Habits
  if (data.diet === 'meat-heavy' || data.diet === 'balanced') {
    recs.push({
      title: 'Meatless Mondays',
      description: 'Skip meat just one day a week to significantly lower your diet footprint.',
      impact: 'medium',
      type: 'weekly-habit'
    });
  }
  if (data.transport === 'car' && (data.carUsage || 0) > 50) {
    recs.push({
      title: 'Carpool or Public Transit Once a Week',
      description: 'Replace one regular car commute with an alternative.',
      impact: 'medium',
      type: 'weekly-habit'
    });
  }

  // Deep Impact
  if (score.highestContributor === 'transport') {
    recs.push({
      title: 'Consider an EV or E-Bike',
      description: 'Transport is your biggest emission source. For your next vehicle, consider electric.',
      impact: 'high',
      type: 'deep-impact'
    });
  } else if (score.highestContributor === 'homeEnergy') {
    recs.push({
      title: 'Switch to a Renewable Energy Plan',
      description: 'Home energy is your top emission source. Contact your provider about green energy options.',
      impact: 'high',
      type: 'deep-impact'
    });
  } else if (score.highestContributor === 'flights') {
    recs.push({
      title: 'Reduce Long-Haul Flights',
      description: 'Flights dominate your footprint. Consider local vacations or train travel next year.',
      impact: 'high',
      type: 'deep-impact'
    });
  }

  // Add fallbacks if we don't have enough
  if (recs.length < 3) {
    recs.push({
      title: 'Start Composting',
      description: 'Reduce methane emissions from landfills by composting food scraps.',
      impact: 'medium',
      type: 'weekly-habit'
    });
  }

  return recs;
}
