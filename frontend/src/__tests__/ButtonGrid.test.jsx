import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ButtonGrid from '../components/ButtonGrid';

function renderButtonGrid(overrides = {}) {
  const props = {
    onDigit: vi.fn(),
    onOperator: vi.fn(),
    onEquals: vi.fn(),
    onClear: vi.fn(),
    onDecimal: vi.fn(),
    ...overrides,
  };
  render(<ButtonGrid {...props} />);
  return props;
}

describe('ButtonGrid', () => {
  it('renders all expected digit buttons', () => {
    renderButtonGrid();
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((d) => {
      expect(screen.getByRole('button', { name: d })).toBeInTheDocument();
    });
  });

  it('renders all operator buttons', () => {
    renderButtonGrid();
    ['+', '-', '*', '/'].forEach((op) => {
      expect(screen.getByRole('button', { name: op })).toBeInTheDocument();
    });
  });

  it('renders C, dot, and equals buttons', () => {
    renderButtonGrid();
    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
  });

  it('clicking a digit button calls onDigit with the correct value', async () => {
    const user = userEvent.setup();
    const { onDigit } = renderButtonGrid();
    await user.click(screen.getByRole('button', { name: '7' }));
    expect(onDigit).toHaveBeenCalledWith('7');
  });

  it('clicking an operator button calls onOperator with the correct value', async () => {
    const user = userEvent.setup();
    const { onOperator } = renderButtonGrid();
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(onOperator).toHaveBeenCalledWith('+');
  });

  it('clicking equals button calls onEquals', async () => {
    const user = userEvent.setup();
    const { onEquals } = renderButtonGrid();
    await user.click(screen.getByRole('button', { name: '=' }));
    expect(onEquals).toHaveBeenCalled();
  });

  it('clicking C calls onClear', async () => {
    const user = userEvent.setup();
    const { onClear } = renderButtonGrid();
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('clicking dot button calls onDecimal', async () => {
    const user = userEvent.setup();
    const { onDecimal } = renderButtonGrid();
    await user.click(screen.getByRole('button', { name: '.' }));
    expect(onDecimal).toHaveBeenCalled();
  });

  it('clicking each digit calls onDigit with the correct value', async () => {
    const user = userEvent.setup();
    const { onDigit } = renderButtonGrid();
    for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      await user.click(screen.getByRole('button', { name: digit }));
      expect(onDigit).toHaveBeenCalledWith(digit);
    }
  });

  it('clicking each operator calls onOperator with the correct value', async () => {
    const user = userEvent.setup();
    const { onOperator } = renderButtonGrid();
    for (const op of ['+', '-', '*', '/']) {
      await user.click(screen.getByRole('button', { name: op }));
      expect(onOperator).toHaveBeenCalledWith(op);
    }
  });
});
