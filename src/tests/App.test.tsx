// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the 3D scene since WebGL doesn't work well in JSDOM
vi.mock('../components/EcoScene', () => ({
  EcoScene: () => <div data-testid="mock-eco-scene" />
}));

describe('App Component', () => {
  it('renders without crashing and shows loading state then content', async () => {
    render(<App />);
    
    // It should show the loading fallback initially due to React.lazy
    expect(screen.getAllByText(/Loading experience/i).length).toBeGreaterThan(0);
    
    // Then it should resolve the lazy components and show the title
    expect(await screen.findByText(/Build Your World/i)).toBeTruthy();
  });
});
