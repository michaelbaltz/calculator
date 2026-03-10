import { useCalculator } from '../hooks/useCalculator';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import ScientificButtonGrid from './ScientificButtonGrid';

/**
 * Root calculator component wiring the useCalculator hook to the UI.
 */
function Calculator() {
  const {
    displayValue,
    error,
    mode,
    handleDigit,
    handleOperator,
    handleEquals,
    handleClear,
    handleDecimal,
    handleScientificUnary,
    handleScientificBinary,
    toggleMode,
  } = useCalculator();

  return (
    <div className="calculator">
      <div className="calculator__mode-bar">
        <button
          className={`calc-mode-toggle calc-mode-toggle--${mode}`}
          onClick={toggleMode}
          aria-label={mode === 'basic' ? 'Switch to scientific mode' : 'Switch to basic mode'}
        >
          {mode === 'basic' ? 'SCI' : 'BASIC'}
        </button>
      </div>
      <Display value={displayValue} error={error} />
      {mode === 'scientific' && (
        <ScientificButtonGrid
          onUnary={handleScientificUnary}
          onBinary={handleScientificBinary}
        />
      )}
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
