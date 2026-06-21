// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssessmentFlow } from '../components/AssessmentFlow';
import { useCarbonStore } from '../store/useCarbonStore';

vi.mock('../store/useCarbonStore', () => ({
  useCarbonStore: vi.fn()
}));

describe('AssessmentFlow Component', () => {
  it('renders initial step without crashing', () => {
    (useCarbonStore as any).mockReturnValue({
      submitAssessment: vi.fn()
    });

    render(<AssessmentFlow />);
    expect(screen.getByText(/Build Your World/i)).toBeTruthy();
    expect(screen.getByText(/Transportation/i)).toBeTruthy();
  });
});
