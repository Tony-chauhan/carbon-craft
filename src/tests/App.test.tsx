// @vitest-environment jsdom

// Define a functional localStorage mock before importing App/Store
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true
});

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock all lazy-loaded subcomponents of App
vi.mock('../components/EcoScene', () => ({
  EcoScene: () => <div data-testid="mock-eco-scene" />
}));
vi.mock('../components/AssessmentFlow', () => ({
  AssessmentFlow: () => <div data-testid="mock-assessment-flow">Build Your World</div>
}));
vi.mock('../components/Dashboard', () => ({
  Dashboard: () => <div data-testid="mock-dashboard">Your Carbon Footprint</div>
}));
vi.mock('../components/SimulationPanel', () => ({
  SimulationPanel: () => <div data-testid="mock-simulation-panel">What-If Simulator</div>
}));
vi.mock('../components/Gamification', () => ({
  Gamification: () => <div data-testid="mock-gamification">Journey Panel</div>
}));

let App: any;
let useCarbonStore: any;

beforeAll(async () => {
  const appModule = await import('../App');
  App = appModule.default;

  const storeModule = await import('../store/useCarbonStore');
  useCarbonStore = storeModule.useCarbonStore;
});

describe('App Onboarding-to-Dashboard Flow Integration', () => {
  beforeEach(() => {
    useCarbonStore.getState().resetData();
  });

  it('renders onboarding initially', async () => {
    render(<App />);
    
    // It should show the loading fallback initially due to React.lazy
    expect(screen.getAllByText(/Loading experience/i).length).toBeGreaterThan(0);
    
    // Then it should resolve the lazy components and show the onboarding wizard
    expect(await screen.findByText(/Build Your World/i)).toBeTruthy();
  });

  it('transitions to the main dashboard when onboarding data is populated', async () => {
    // Populate store to bypass onboarding
    useCarbonStore.getState().submitAssessment({
      transport: 'mixed',
      carUsage: 100,
      homeEnergy: 'mixed',
      energyUsage: 500,
      diet: 'balanced',
      shopping: 'average',
      waste: 'average',
      flights: 1
    });

    render(<App />);

    // Dashboard should display directly
    expect(await screen.findByText(/Your Carbon Footprint/i)).toBeTruthy();
    expect(screen.queryByText(/Build Your World/i)).toBeNull();
  });
});
