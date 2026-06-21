// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gamification } from '../components/Gamification';
import { useCarbonStore } from '../store/useCarbonStore';

vi.mock('../store/useCarbonStore', () => ({
  useCarbonStore: vi.fn()
}));

describe('Gamification Component', () => {
  it('renders without crashing', () => {
    (useCarbonStore as any).mockReturnValue({
      xp: 50,
      ecoLevel: 'Aware',
      achievements: []
    });

    render(<Gamification />);
    expect(screen.getByText(/Current Status/i)).toBeTruthy();
    expect(screen.getByText(/Aware/i)).toBeTruthy();
  });
});
