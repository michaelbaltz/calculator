import { useState } from 'react';
import { calculus } from '../api/calculatorApi';

/** Maps display labels to API operation strings. */
const OPERATIONS = [
  { label: 'd/dx', value: 'derivative' },
  { label: '∫ dx', value: 'integral' },
  { label: '∫ₐᵇ dx', value: 'definite_integral' },
];

/**
 * A self-contained panel for symbolic calculus operations.
 * Manages its own local state and calls the calculus API directly.
 */
function CalculusPanel() {
  const [operation, setOperation] = useState('derivative');
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isDefinite = operation === 'definite_integral';

  /**
   * Submits the calculus request to the backend and updates result/error state.
   * @return {Promise<void>}
   */
  const handleCalculate = async () => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const data = await calculus(
        operation,
        expression,
        variable,
        isDefinite ? lower : null,
        isDefinite ? upper : null,
      );
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculus-panel">
      <div className="calculus-panel__ops">
        {OPERATIONS.map(({ label, value }) => (
          <button
            key={value}
            className={`calc-button calc-button--calculus${operation === value ? ' calc-button--calculus-active' : ''}`}
            onClick={() => setOperation(value)}
            aria-pressed={operation === value}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        className="calculus-panel__input"
        type="text"
        placeholder="e.g. x**2 + 3*x"
        aria-label="expression"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
      />

      <input
        className="calculus-panel__input"
        type="text"
        placeholder="variable"
        aria-label="variable"
        value={variable}
        onChange={(e) => setVariable(e.target.value)}
      />

      {isDefinite && (
        <div className="calculus-panel__bounds">
          <input
            className="calculus-panel__input"
            type="text"
            placeholder="lower bound"
            aria-label="lower bound"
            value={lower}
            onChange={(e) => setLower(e.target.value)}
          />
          <input
            className="calculus-panel__input"
            type="text"
            placeholder="upper bound"
            aria-label="upper bound"
            value={upper}
            onChange={(e) => setUpper(e.target.value)}
          />
        </div>
      )}

      <button
        className="calc-button calc-button--equals calculus-panel__calculate"
        onClick={handleCalculate}
        disabled={loading}
      >
        Calculate
      </button>

      {result !== null && (
        <div className="calculus-panel__result">{result}</div>
      )}
      {error !== null && (
        <div className="calculus-panel__result calculus-panel__result--error">{error}</div>
      )}
    </div>
  );
}

export default CalculusPanel;
