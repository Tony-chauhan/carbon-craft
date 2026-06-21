import type { AssessmentData } from './validationSchema';

export type CategoryBreakdown = {
  transport: number;
  homeEnergy: number;
  diet: number;
  shopping: number;
  waste: number;
  flights: number;
};

export type ScoreResult = {
  total: number;
  breakdown: CategoryBreakdown;
  highestContributor: keyof CategoryBreakdown;
};

/**
 * Calculates the estimated carbon footprint score based on user inputs.
 * @param data User lifestyle inputs including transport, diet, and energy usage.
 * @returns Total score and category breakdown in kg CO2e.
 */
export function calculateScore(data: AssessmentData): ScoreResult {
  let transport = 0;
  if (data.transport === 'car') transport = 200 + (data.carUsage || 0) * 0.4;
  else if (data.transport === 'mixed') transport = 100 + (data.carUsage || 0) * 0.2;
  else if (data.transport === 'public') transport = 50;
  else if (data.transport === 'bike' || data.transport === 'walk') transport = 10;

  let homeEnergy = data.energyUsage * 0.5; // roughly 0.5 kg CO2 per kWh average
  if (data.homeEnergy === 'renewable') homeEnergy *= 0.1;
  else if (data.homeEnergy === 'mixed') homeEnergy *= 0.7;

  let diet = 0;
  if (data.diet === 'meat-heavy') diet = 300;
  else if (data.diet === 'balanced') diet = 200;
  else if (data.diet === 'vegetarian') diet = 100;
  else if (data.diet === 'vegan') diet = 50;

  let shopping = 0;
  if (data.shopping === 'frequent') shopping = 200;
  else if (data.shopping === 'average') shopping = 100;
  else if (data.shopping === 'rare') shopping = 50;
  else if (data.shopping === 'second-hand') shopping = 20;

  let waste = 0;
  if (data.waste === 'high') waste = 100;
  else if (data.waste === 'average') waste = 50;
  else if (data.waste === 'low') waste = 20;
  else if (data.waste === 'zero-waste') waste = 5;

  const flights = (data.flights || 0) * 250; // approx 250kg per short flight

  const breakdown: CategoryBreakdown = {
    transport,
    homeEnergy,
    diet,
    shopping,
    waste,
    flights
  };

  const total = transport + homeEnergy + diet + shopping + waste + flights;

  let highestContributor: keyof CategoryBreakdown = 'transport';
  let maxVal = transport;

  for (const [key, value] of Object.entries(breakdown)) {
    if (value > maxVal) {
      maxVal = value;
      highestContributor = key as keyof CategoryBreakdown;
    }
  }

  return {
    total: Math.round(total),
    breakdown: {
      transport: Math.round(transport),
      homeEnergy: Math.round(homeEnergy),
      diet: Math.round(diet),
      shopping: Math.round(shopping),
      waste: Math.round(waste),
      flights: Math.round(flights),
    },
    highestContributor
  };
}
