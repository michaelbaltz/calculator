import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalculusPanel from '../components/CalculusPanel';
import * as calculatorApi from '../api/calculatorApi';

vi.mock('../api/calculatorApi', () => ({
  calculus: vi.fn(),
}));

describe('CalculusPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the three operation buttons', () => {
    render(<CalculusPanel />);
    expect(screen.getByRole('button', { name: 'd/dx' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '∫ dx' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '∫ₐᵇ dx' })).toBeInTheDocument();
  });

  it('renders expression and variable inputs', () => {
    render(<CalculusPanel />);
    expect(screen.getByRole('textbox', { name: 'expression' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'variable' })).toBeInTheDocument();
  });

  it('renders the Calculate button', () => {
    render(<CalculusPanel />);
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument();
  });

  it('does not show bound inputs for derivative mode (default)', () => {
    render(<CalculusPanel />);
    expect(screen.queryByRole('textbox', { name: 'lower bound' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'upper bound' })).not.toBeInTheDocument();
  });

  it('does not show bound inputs for integral mode', async () => {
    const user = userEvent.setup();
    render(<CalculusPanel />);
    await user.click(screen.getByRole('button', { name: '∫ dx' }));
    expect(screen.queryByRole('textbox', { name: 'lower bound' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'upper bound' })).not.toBeInTheDocument();
  });

  it('shows bound inputs when definite_integral is selected', async () => {
    const user = userEvent.setup();
    render(<CalculusPanel />);
    await user.click(screen.getByRole('button', { name: '∫ₐᵇ dx' }));
    expect(screen.getByRole('textbox', { name: 'lower bound' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'upper bound' })).toBeInTheDocument();
  });

  it('bound inputs hidden again after switching away from definite_integral', async () => {
    const user = userEvent.setup();
    render(<CalculusPanel />);
    await user.click(screen.getByRole('button', { name: '∫ₐᵇ dx' }));
    expect(screen.getByRole('textbox', { name: 'lower bound' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'd/dx' }));
    expect(screen.queryByRole('textbox', { name: 'lower bound' })).not.toBeInTheDocument();
  });

  it('calls calculus API with correct args for derivative', async () => {
    calculatorApi.calculus.mockResolvedValue({ result: '2*x + 3' });
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.clear(screen.getByRole('textbox', { name: 'expression' }));
    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'x**2 + 3*x');
    await user.clear(screen.getByRole('textbox', { name: 'variable' }));
    await user.type(screen.getByRole('textbox', { name: 'variable' }), 'x');

    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    await waitFor(() => {
      expect(calculatorApi.calculus).toHaveBeenCalledWith(
        'derivative',
        'x**2 + 3*x',
        'x',
        null,
        null,
      );
    });
  });

  it('calls calculus API with correct args for integral', async () => {
    calculatorApi.calculus.mockResolvedValue({ result: 'x**3/3' });
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.click(screen.getByRole('button', { name: '∫ dx' }));
    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'x**2');

    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    await waitFor(() => {
      expect(calculatorApi.calculus).toHaveBeenCalledWith(
        'integral',
        'x**2',
        'x',
        null,
        null,
      );
    });
  });

  it('calls calculus API with correct args for definite_integral', async () => {
    calculatorApi.calculus.mockResolvedValue({ result: '8' });
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.click(screen.getByRole('button', { name: '∫ₐᵇ dx' }));
    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'x**2');
    await user.type(screen.getByRole('textbox', { name: 'lower bound' }), '0');
    await user.type(screen.getByRole('textbox', { name: 'upper bound' }), '2');

    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    await waitFor(() => {
      expect(calculatorApi.calculus).toHaveBeenCalledWith(
        'definite_integral',
        'x**2',
        'x',
        '0',
        '2',
      );
    });
  });

  it('shows result string on successful calculation', async () => {
    calculatorApi.calculus.mockResolvedValue({ result: '2*x' });
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'x**2');
    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    await waitFor(() => {
      expect(screen.getByText('2*x')).toBeInTheDocument();
    });
  });

  it('shows error message in red on API failure', async () => {
    calculatorApi.calculus.mockRejectedValue(new Error('Unsupported expression'));
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'bad_expr');
    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    await waitFor(() => {
      const errorEl = screen.getByText('Unsupported expression');
      expect(errorEl).toBeInTheDocument();
      expect(errorEl).toHaveClass('calculus-panel__result--error');
    });
  });

  it('clears previous result/error when a new calculation starts', async () => {
    calculatorApi.calculus
      .mockResolvedValueOnce({ result: '2*x' })
      .mockRejectedValueOnce(new Error('oops'));
    const user = userEvent.setup();
    render(<CalculusPanel />);

    await user.type(screen.getByRole('textbox', { name: 'expression' }), 'x**2');
    await user.click(screen.getByRole('button', { name: 'Calculate' }));
    await waitFor(() => expect(screen.getByText('2*x')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Calculate' }));
    await waitFor(() => expect(screen.getByText('oops')).toBeInTheDocument());
    expect(screen.queryByText('2*x')).not.toBeInTheDocument();
  });
});
