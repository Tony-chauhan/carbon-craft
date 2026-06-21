// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';
import { useCarbonStore } from '../store/useCarbonStore';

// Mock the store
vi.mock('../store/useCarbonStore', () => ({
  useCarbonStore: vi.fn()
}));

describe('Dashboard Component', () => {
  it('renders without crashing with empty data', () => {
    (useCarbonStore as any).mockReturnValue({
      score: { total: 4000, highestContributor: 'transport', breakdown: { transport: 2000, diet: 1000 } },
      insight: 'Test insight',
      recommendations: [{ title: 'Walk more', impact: 'high', type: 'quick-win' }]
    });

    render(<Dashboard />);
    expect(screen.getByText(/Your Footprint/i)).toBeTruthy();
  });
});
