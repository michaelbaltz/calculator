import { useState, useRef } from 'react';
import { calculate } from '../api/calculatorApi';

/** @typedef {{ displayValue: string, operandA: number|null, operator: string|null, waitingForOperand: boolean, error: string|null }} CalculatorState */

const INITIAL_STATE = {
  displayValue: '0',
  operandA: null,
  operator: null,
  waitingForOperand: false,
  error: null,
};

const MAX_DIGITS = 12;

/**
 * Custom hook managing all calculator state and logic.
 * @return {{
 *   displayValue: string,
 *   error: string|null,
 *   handleDigit: function(string): void,
 *   handleOperator: function(string): void,
 *   handleEquals: function(): Promise<void>,
 *   handleClear: function(): void,
 *   handleDecimal: function(): void,
 * }}
 */
export function useCalculator() {
  const [state, setState] = useState(INITIAL_STATE);
  // Keep a ref in sync so handleEquals can read current state synchronously.
  const stateRef = useRef(state);

  /**
   * Updates both state and stateRef atomically.
   * @param {function(CalculatorState): CalculatorState} updater
   */
  const updateState = (updater) => {
    setState((prev) => {
      const next = updater(prev);
      stateRef.current = next;
      return next;
    });
  };

  /**
   * Appends a digit to the display or replaces it if waiting for a new operand.
   * @param {string} digit - The digit string to input.
   */
  const handleDigit = (digit) => {
    updateState((prev) => {
      if (prev.waitingForOperand) {
        return { ...prev, displayValue: digit, waitingForOperand: false, error: null };
      }
      // Enforce maximum digit count (ignoring the decimal point).
      const digitsOnly = prev.displayValue.replace('.', '').replace('-', '');
      if (digitsOnly.length >= MAX_DIGITS && prev.displayValue !== '0') {
        return prev;
      }
      const displayValue = prev.displayValue === '0' ? digit : prev.displayValue + digit;
      return { ...prev, displayValue, error: null };
    });
  };

  /**
   * Stores the current display as operandA and records the operator.
   * @param {string} op - The operator to apply.
   */
  const handleOperator = (op) => {
    updateState((prev) => ({
      ...prev,
      operandA: parseFloat(prev.displayValue),
      operator: op,
      waitingForOperand: true,
      error: null,
    }));
  };

  /**
   * Calls the backend API with stored operands and updates display with the result.
   * @return {Promise<void>}
   */
  const handleEquals = async () => {
    const { operandA, operator, displayValue } = stateRef.current;

    if (operandA === null || operator === null) {
      return;
    }

    try {
      const result = await calculate(operandA, parseFloat(displayValue), operator);
      updateState((prev) => ({
        ...prev,
        displayValue: String(result.result),
        operandA: null,
        operator: null,
        waitingForOperand: false,
        error: null,
      }));
    } catch (err) {
      updateState((prev) => ({
        ...prev,
        error: err.message,
        operandA: null,
        operator: null,
      }));
    }
  };

  /**
   * Resets all calculator state to its initial values.
   */
  const handleClear = () => {
    updateState(() => INITIAL_STATE);
  };

  /**
   * Appends a decimal point to the display if one is not already present.
   */
  const handleDecimal = () => {
    updateState((prev) => {
      if (prev.displayValue.includes('.')) {
        return prev;
      }
      if (prev.waitingForOperand) {
        return { ...prev, displayValue: '0.', waitingForOperand: false, error: null };
      }
      return { ...prev, displayValue: prev.displayValue + '.', error: null };
    });
  };

  return {
    displayValue: state.displayValue,
    error: state.error,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleDecimal,
  };
}
