import { z } from 'zod';

// SECURITY: Zod validation ensures no invalid or malicious input can enter the application state.
// This strictly prevents prototype pollution, injection attacks, and unexpected type casting.
export const assessmentSchema = z.object({
  transport: z.enum(['car', 'public', 'bike', 'walk', 'mixed']),
  carUsage: z.number().min(0).max(1000).optional(), // miles per week
  homeEnergy: z.enum(['renewable', 'mixed', 'fossil']),
  energyUsage: z.number().min(0).max(5000), // kWh per month
  diet: z.enum(['meat-heavy', 'balanced', 'vegetarian', 'vegan']),
  shopping: z.enum(['frequent', 'average', 'rare', 'second-hand']),
  waste: z.enum(['high', 'average', 'low', 'zero-waste']),
  flights: z.number().min(0).max(50) // flights per year
});

export type AssessmentData = z.infer<typeof assessmentSchema>;
