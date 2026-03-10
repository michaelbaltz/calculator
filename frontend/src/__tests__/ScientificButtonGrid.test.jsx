import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ScientificButtonGrid from '../components/ScientificButtonGrid';

function renderSciGrid(overrides = {}) {
  const props = {
    onUnary: vi.fn(),
    onBinary: vi.fn(),
    ...overrides,
  };
  render(<ScientificButtonGrid {...props} />);
  return props;
}

describe('ScientificButtonGrid', () => {
  it('renders all 6 scientific buttons', () => {
    renderSciGrid();
    expect(screen.getByRole('button', { name: 'n!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ln' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'log' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'eˣ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'xʸ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'logₙ' })).toBeInTheDocument();
  });

  it('clicking n! calls onUnary with "factorial"', async () => {
    const user = userEvent.setup();
    const { onUnary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'n!' }));
    expect(onUnary).toHaveBeenCalledWith('factorial');
  });

  it('clicking ln calls onUnary with "log"', async () => {
    const user = userEvent.setup();
    const { onUnary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'ln' }));
    expect(onUnary).toHaveBeenCalledWith('log');
  });

  it('clicking log calls onUnary with "log10"', async () => {
    const user = userEvent.setup();
    const { onUnary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'log' }));
    expect(onUnary).toHaveBeenCalledWith('log10');
  });

  it('clicking eˣ calls onUnary with "exp"', async () => {
    const user = userEvent.setup();
    const { onUnary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'eˣ' }));
    expect(onUnary).toHaveBeenCalledWith('exp');
  });

  it('clicking xʸ calls onBinary with "power"', async () => {
    const user = userEvent.setup();
    const { onBinary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'xʸ' }));
    expect(onBinary).toHaveBeenCalledWith('power');
  });

  it('clicking logₙ calls onBinary with "log_base"', async () => {
    const user = userEvent.setup();
    const { onBinary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'logₙ' }));
    expect(onBinary).toHaveBeenCalledWith('log_base');
  });

  it('unary buttons do not trigger onBinary', async () => {
    const user = userEvent.setup();
    const { onBinary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'n!' }));
    await user.click(screen.getByRole('button', { name: 'ln' }));
    await user.click(screen.getByRole('button', { name: 'log' }));
    await user.click(screen.getByRole('button', { name: 'eˣ' }));
    expect(onBinary).not.toHaveBeenCalled();
  });

  it('binary buttons do not trigger onUnary', async () => {
    const user = userEvent.setup();
    const { onUnary } = renderSciGrid();
    await user.click(screen.getByRole('button', { name: 'xʸ' }));
    await user.click(screen.getByRole('button', { name: 'logₙ' }));
    expect(onUnary).not.toHaveBeenCalled();
  });
});
