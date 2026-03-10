import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCalculator } from '../hooks/useCalculator';
import * as calculatorApi from '../api/calculatorApi';

vi.mock('../api/calculatorApi');

describe('useCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initialises with displayValue "0"', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.displayValue).toBe('0');
    expect(result.current.error).toBeNull();
  });

  it('handleDigit appends digits to build displayValue', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('4'));
    expect(result.current.displayValue).toBe('4');
    act(() => result.current.handleDigit('2'));
    expect(result.current.displayValue).toBe('42');
  });

  it('handleDigit replaces "0" with first digit', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('5'));
    expect(result.current.displayValue).toBe('5');
  });

  it('handleOperator stores operandA and sets waitingForOperand', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('7'));
    act(() => result.current.handleOperator('+'));
    // After pressing an operator, next digit should replace the display
    act(() => result.current.handleDigit('3'));
    expect(result.current.displayValue).toBe('3');
  });

  it('handleDecimal appends a decimal point', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDecimal());
    expect(result.current.displayValue).toBe('3.');
  });

  it('handleDecimal does not add a second decimal point', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDecimal());
    act(() => result.current.handleDecimal());
    expect(result.current.displayValue).toBe('3.');
  });

  it('handleClear resets all state', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('9'));
    act(() => result.current.handleOperator('+'));
    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleClear());
    expect(result.current.displayValue).toBe('0');
    expect(result.current.error).toBeNull();
  });

  it('handleEquals calls calculatorApi.calculate with correct args and updates displayValue', async () => {
    calculatorApi.calculate.mockResolvedValue({ result: 15 });

    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('0'));
    act(() => result.current.handleOperator('+'));
    act(() => result.current.handleDigit('5'));

    await act(async () => {
      await result.current.handleEquals();
    });

    expect(calculatorApi.calculate).toHaveBeenCalledWith(10, 5, '+');
    expect(result.current.displayValue).toBe('15');
    expect(result.current.error).toBeNull();
  });

  it('handleEquals sets error state when API throws', async () => {
    calculatorApi.calculate.mockRejectedValue(new Error('Division by zero'));

    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('5'));
    act(() => result.current.handleOperator('/'));
    act(() => result.current.handleDigit('0'));

    await act(async () => {
      await result.current.handleEquals();
    });

    expect(result.current.error).toBe('Division by zero');
  });

  it('handleEquals does nothing when operandA or operator is null', async () => {
    calculatorApi.calculate.mockResolvedValue({ result: 0 });

    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('5'));

    await act(async () => {
      await result.current.handleEquals();
    });

    expect(calculatorApi.calculate).not.toHaveBeenCalled();
    expect(result.current.displayValue).toBe('5');
  });

  it('handleDigit enforces MAX_DIGITS limit', () => {
    const { result } = renderHook(() => useCalculator());
    // Enter 12 digits
    '123456789012'.split('').forEach((d) => {
      act(() => result.current.handleDigit(d));
    });
    const afterTwelve = result.current.displayValue;
    expect(afterTwelve.length).toBe(12);
    // 13th digit should be ignored
    act(() => result.current.handleDigit('9'));
    expect(result.current.displayValue).toBe(afterTwelve);
  });

  it('handleDecimal after operator creates "0." as start of new operand', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleDigit('5'));
    act(() => result.current.handleOperator('+'));
    act(() => result.current.handleDecimal());
    expect(result.current.displayValue).toBe('0.');
  });
});
