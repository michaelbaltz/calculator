import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Display from '../components/Display';

describe('Display', () => {
  it('renders the value prop', () => {
    render(<Display value="123" error={null} />);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders the error message when error prop is set', () => {
    render(<Display value="0" error="Division by zero" />);
    const errorEl = screen.getByText('Division by zero');
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveClass('calc-display__error');
  });

  it('does not render the error class when error is null', () => {
    render(<Display value="42" error={null} />);
    expect(screen.queryByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('42')).toHaveClass('calc-display__value');
  });

  it('renders error in red via CSS class', () => {
    render(<Display value="0" error="Error occurred" />);
    const errorEl = screen.getByText('Error occurred');
    // The class should signal red styling
    expect(errorEl.className).toContain('error');
  });
});
