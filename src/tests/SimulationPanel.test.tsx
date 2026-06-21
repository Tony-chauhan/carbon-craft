// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimulationPanel } from '../components/SimulationPanel';
import { useCarbonStore } from '../store/useCarbonStore';

vi.mock('../store/useCarbonStore', () => ({
  useCarbonStore: vi.fn()
}));

describe('SimulationPanel Component', () => {
  it('renders without crashing when simulation score is present', () => {
    (useCarbonStore as any).mockReturnValue({
      assessmentData: { transport: 'car', homeEnergy: 'mixed', diet: 'balanced', shopping: 'average', waste: 'average', flights: 0, carUsage: 100, energyUsage: 500 },
      simulationScore: { total: 3500 },
      updateSimulation: vi.fn(),
      toggleSimulationMode: vi.fn()
    });

    render(<SimulationPanel />);
    expect(screen.getByText(/What-If Simulator/i)).toBeTruthy();
    expect(screen.getByText(/3500/i)).toBeTruthy();
  });
});
