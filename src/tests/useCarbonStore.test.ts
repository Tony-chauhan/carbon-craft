// @vitest-environment jsdom
// Define a functional localStorage mock before importing useCarbonStore
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: () => null,
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
    writable: true
  });
}

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

let useCarbonStore: any;

beforeAll(async () => {
  const module = await import('../store/useCarbonStore');
  useCarbonStore = module.useCarbonStore;
});
import type { AssessmentData } from '../utils/validationSchema';

describe('Zustand useCarbonStore State Machine', () => {
  beforeEach(() => {
    // Reset Zustand store to initial state before each test
    useCarbonStore.getState().resetData();
  });

  it('should initialize with correct default values', () => {
    const state = useCarbonStore.getState();
    expect(state.assessmentData).toBeNull();
    expect(state.score).toBeNull();
    expect(state.xp).toBe(0);
    expect(state.ecoLevel).toBe('Beginner');
    expect(state.streak).toBe(0);
    expect(state.isSimulationMode).toBe(false);
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('should process assessment submissions correctly', () => {
    const testData: AssessmentData = {
      transport: 'public',
      carUsage: 0,
      homeEnergy: 'renewable',
      energyUsage: 100,
      diet: 'vegan',
      shopping: 'rare',
      waste: 'zero-waste',
      flights: 0
    };

    useCarbonStore.getState().submitAssessment(testData);

    const state = useCarbonStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(state.assessmentData).toEqual(testData);
    expect(state.score).not.toBeNull();
    expect(state.score!.total).toBeGreaterThan(0);
    expect(state.xp).toBe(50); // initial XP awarded for onboarding action
    expect(state.ecoLevel).toBe('Aware'); // 50 XP reaches 'Aware' level
  });

  it('should isolate simulation data changes from actual assessment data', () => {
    const actualData: AssessmentData = {
      transport: 'car',
      carUsage: 300,
      homeEnergy: 'fossil',
      energyUsage: 800,
      diet: 'meat-heavy',
      shopping: 'frequent',
      waste: 'high',
      flights: 5
    };

    useCarbonStore.getState().submitAssessment(actualData);
    
    // Toggle simulation mode
    useCarbonStore.getState().toggleSimulationMode(true);
    let state = useCarbonStore.getState();
    expect(state.isSimulationMode).toBe(true);

    const simulatedData: AssessmentData = {
      ...actualData,
      transport: 'walk',
      carUsage: 0,
      diet: 'vegan'
    };

    useCarbonStore.getState().updateSimulation(simulatedData);

    state = useCarbonStore.getState();
    // Simulated score should be lower than actual score
    expect(state.simulationScore!.total).toBeLessThan(state.score!.total);
    // Actual score must remain untouched
    expect(state.assessmentData!.transport).toBe('car');
    expect(state.simulationData!.transport).toBe('walk');

    // Turn off simulation mode and check data restore
    useCarbonStore.getState().toggleSimulationMode(false);
    state = useCarbonStore.getState();
    expect(state.isSimulationMode).toBe(false);
  });

  it('should handle streak and xp increments properly', () => {
    const store = useCarbonStore.getState();
    
    // Log action once
    store.logAction(40);
    expect(useCarbonStore.getState().xp).toBe(40);
    expect(useCarbonStore.getState().streak).toBe(1);

    // Log another action on the same day (streak shouldn't double, but XP accumulates)
    useCarbonStore.getState().logAction(30);
    expect(useCarbonStore.getState().xp).toBe(70);
    expect(useCarbonStore.getState().streak).toBe(1);
    expect(useCarbonStore.getState().ecoLevel).toBe('Aware'); // 70 XP > 50 XP
  });

  it('should reset store completely on resetData call', () => {
    const testData: AssessmentData = {
      transport: 'bike',
      carUsage: 0,
      homeEnergy: 'mixed',
      energyUsage: 200,
      diet: 'vegetarian',
      shopping: 'average',
      waste: 'average',
      flights: 1
    };

    useCarbonStore.getState().submitAssessment(testData);
    expect(useCarbonStore.getState().assessmentData).not.toBeNull();

    useCarbonStore.getState().resetData();
    const state = useCarbonStore.getState();
    expect(state.assessmentData).toBeNull();
    expect(state.score).toBeNull();
    expect(state.xp).toBe(0);
    expect(state.hasCompletedOnboarding).toBe(false);
  });
});
