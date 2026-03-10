import { useCalculator } from '../hooks/useCalculator';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import ScientificButtonGrid from './ScientificButtonGrid';
import CalculusPanel from './CalculusPanel';

/** Maps the current mode to the label shown on the toggle button. */
const MODE_LABEL = { basic: 'SCI', scientific: 'CALC', calculus: 'BASIC' };

/** Maps the current mode to an accessible aria-label for the toggle button. */
const MODE_ARIA = {
  basic: 'Switch to scientific mode',
  scientific: 'Switch to calculus mode',
  calculus: 'Switch to basic mode',
};

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

  const isCalculus = mode === 'calculus';

  return (
    <div className="calculator">
      <div className="calculator__mode-bar">
        <button
          className={`calc-mode-toggle calc-mode-toggle--${mode}`}
          onClick={toggleMode}
          aria-label={MODE_ARIA[mode]}
        >
          {MODE_LABEL[mode]}
        </button>
      </div>
      {isCalculus ? (
        <CalculusPanel />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Calculator;
