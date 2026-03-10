import { useState, useRef } from 'react';
import { calculate, scientific } from '../api/calculatorApi';

/**
 * @typedef {{
 *   displayValue: string,
 *   operandA: number|null,
 *   operator: string|null,
 *   waitingForOperand: boolean,
 *   error: string|null,
 *   pendingScientific: string|null,
 *   mode: 'basic'|'scientific',
 * }} CalculatorState
 */

const INITIAL_STATE = {
  displayValue: '0',
  operandA: null,
  operator: null,
  waitingForOperand: false,
  error: null,
  pendingScientific: null,
  mode: 'basic',
};

const MAX_DIGITS = 12;

/**
 * Custom hook managing all calculator state and logic.
 * @return {{
 *   displayValue: string,
 *   error: string|null,
 *   mode: 'basic'|'scientific',
 *   handleDigit: function(string): void,
 *   handleOperator: function(string): void,
 *   handleEquals: function(): Promise<void>,
 *   handleClear: function(): void,
 *   handleDecimal: function(): void,
 *   handleScientificUnary: function(string): Promise<void>,
 *   handleScientificBinary: function(string): void,
 *   toggleMode: function(): void,
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
   * Handles both basic arithmetic and pending scientific binary operations.
   * @return {Promise<void>}
   */
  const handleEquals = async () => {
    const { operandA, operator, displayValue, pendingScientific } = stateRef.current;

    if (pendingScientific !== null && operandA !== null) {
      try {
        const result = await scientific(
          pendingScientific,
          operandA,
          parseFloat(displayValue),
        );
        updateState((prev) => ({
          ...prev,
          displayValue: String(result.result),
          operandA: null,
          operator: null,
          pendingScientific: null,
          waitingForOperand: false,
          error: null,
        }));
      } catch (err) {
        updateState((prev) => ({
          ...prev,
          error: err.message,
          operandA: null,
          operator: null,
          pendingScientific: null,
        }));
      }
      return;
    }

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
   * Immediately calls the scientific API for a unary operation and updates display.
   * @param {string} operation - The scientific operation name (e.g. 'factorial', 'log').
   * @return {Promise<void>}
   */
  const handleScientificUnary = async (operation) => {
    const { displayValue } = stateRef.current;
    try {
      const result = await scientific(operation, parseFloat(displayValue));
      updateState((prev) => ({
        ...prev,
        displayValue: String(result.result),
        waitingForOperand: false,
        error: null,
      }));
    } catch (err) {
      updateState((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  /**
   * Stores the current display as operandA and records the pending scientific binary operation.
   * Waits for the user to enter the second operand and press equals.
   * @param {string} operation - The scientific binary operation name (e.g. 'power', 'log_base').
   */
  const handleScientificBinary = (operation) => {
    updateState((prev) => ({
      ...prev,
      operandA: parseFloat(prev.displayValue),
      pendingScientific: operation,
      operator: null,
      waitingForOperand: true,
      error: null,
    }));
  };

  /**
   * Cycles the calculator through 'basic', 'scientific', and 'calculus' modes.
   */
  const toggleMode = () => {
    updateState((prev) => {
      const next =
        prev.mode === 'basic'
          ? 'scientific'
          : prev.mode === 'scientific'
            ? 'calculus'
            : 'basic';
      return { ...prev, mode: next };
    });
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
    mode: state.mode,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleDecimal,
    handleScientificUnary,
    handleScientificBinary,
    toggleMode,
  };
}
