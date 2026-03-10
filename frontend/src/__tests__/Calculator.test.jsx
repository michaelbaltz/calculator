import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Calculator from '../components/Calculator';

// Mock the API to avoid real network calls
vi.mock('../api/calculatorApi', () => ({
  calculate: vi.fn().mockResolvedValue({ result: 0 }),
}));

describe('Calculator', () => {
  it('renders without crashing', () => {
    render(<Calculator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the Display component with initial value', () => {
    const { container } = render(<Calculator />);
    const displayValue = container.querySelector('.calc-display__value');
    expect(displayValue).toBeInTheDocument();
    expect(displayValue.textContent).toBe('0');
  });

  it('renders the ButtonGrid with all expected buttons', () => {
    render(<Calculator />);
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('has a Display inside the calculator container', () => {
    const { container } = render(<Calculator />);
    expect(container.querySelector('.calculator')).toBeInTheDocument();
    expect(container.querySelector('.calc-display')).toBeInTheDocument();
  });

  it('has a ButtonGrid inside the calculator container', () => {
    const { container } = render(<Calculator />);
    expect(container.querySelector('.calc-button-grid')).toBeInTheDocument();
  });
});
