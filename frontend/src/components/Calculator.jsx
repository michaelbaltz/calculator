import { useCalculator } from '../hooks/useCalculator';
import Display from './Display';
import ButtonGrid from './ButtonGrid';

/**
 * Root calculator component wiring the useCalculator hook to the UI.
 */
function Calculator() {
  const {
    displayValue,
    error,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleDecimal,
  } = useCalculator();

  return (
    <div className="calculator">
      <Display value={displayValue} error={error} />
      <ButtonGrid
        onDigit={handleDigit}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
        onDecimal={handleDecimal}
      />
    </div>
  );
}

export default Calculator;
