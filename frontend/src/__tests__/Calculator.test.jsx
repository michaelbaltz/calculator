import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Calculator from '../components/Calculator';

// Mock the API to avoid real network calls
vi.mock('../api/calculatorApi', () => ({
  calculate: vi.fn().mockResolvedValue({ result: 0 }),
  scientific: vi.fn().mockResolvedValue({ result: 0 }),
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

  it('renders the SCI toggle button in basic mode', () => {
    render(<Calculator />);
    expect(
      screen.getByRole('button', { name: 'Switch to scientific mode' }),
    ).toBeInTheDocument();
  });

  it('ScientificButtonGrid is not shown in basic mode', () => {
    const { container } = render(<Calculator />);
    expect(container.querySelector('.calc-scientific-grid')).not.toBeInTheDocument();
  });

  it('clicking the toggle button switches to scientific mode and shows ScientificButtonGrid', async () => {
    const user = userEvent.setup();
    const { container } = render(<Calculator />);

    await user.click(screen.getByRole('button', { name: 'Switch to scientific mode' }));

    expect(container.querySelector('.calc-scientific-grid')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'n!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ln' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'log' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'eˣ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'xʸ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'logₙ' })).toBeInTheDocument();
  });

  it('clicking the toggle button again hides ScientificButtonGrid', async () => {
    const user = userEvent.setup();
    const { container } = render(<Calculator />);

    await user.click(screen.getByRole('button', { name: 'Switch to scientific mode' }));
    expect(container.querySelector('.calc-scientific-grid')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Switch to basic mode' }));
    expect(container.querySelector('.calc-scientific-grid')).not.toBeInTheDocument();
  });

  it('toggle button label changes to BASIC in scientific mode', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    const toggleBtn = screen.getByRole('button', { name: 'Switch to scientific mode' });
    expect(toggleBtn.textContent).toBe('SCI');

    await user.click(toggleBtn);
    expect(
      screen.getByRole('button', { name: 'Switch to basic mode' }).textContent,
    ).toBe('BASIC');
  });
});
