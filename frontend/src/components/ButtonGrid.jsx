import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Renders the full calculator button grid.
 * Layout:
 *   [ 7 ] [ 8 ] [ 9 ] [ / ]
 *   [ 4 ] [ 5 ] [ 6 ] [ * ]
 *   [ 1 ] [ 2 ] [ 3 ] [ - ]
 *   [ C ] [ 0 ] [ . ] [ + ]
 *   [          =         ]
 *
 * @param {Object} props
 * @param {function(string): void} props.onDigit - Called with a digit string.
 * @param {function(string): void} props.onOperator - Called with an operator string.
 * @param {function(): void} props.onEquals - Called when equals is pressed.
 * @param {function(): void} props.onClear - Called when clear is pressed.
 * @param {function(): void} props.onDecimal - Called when decimal is pressed.
 */
function ButtonGrid({ onDigit, onOperator, onEquals, onClear, onDecimal }) {
  return (
    <div className="calc-button-grid">
      <Button label="7" onClick={() => onDigit('7')} variant="default" />
      <Button label="8" onClick={() => onDigit('8')} variant="default" />
      <Button label="9" onClick={() => onDigit('9')} variant="default" />
      <Button label="/" onClick={() => onOperator('/')} variant="operator" />

      <Button label="4" onClick={() => onDigit('4')} variant="default" />
      <Button label="5" onClick={() => onDigit('5')} variant="default" />
      <Button label="6" onClick={() => onDigit('6')} variant="default" />
      <Button label="*" onClick={() => onOperator('*')} variant="operator" />

      <Button label="1" onClick={() => onDigit('1')} variant="default" />
      <Button label="2" onClick={() => onDigit('2')} variant="default" />
      <Button label="3" onClick={() => onDigit('3')} variant="default" />
      <Button label="-" onClick={() => onOperator('-')} variant="operator" />

      <Button label="C" onClick={onClear} variant="action" />
      <Button label="0" onClick={() => onDigit('0')} variant="default" />
      <Button label="." onClick={onDecimal} variant="default" />
      <Button label="+" onClick={() => onOperator('+')} variant="operator" />

      <Button label="=" onClick={onEquals} variant="equals" />
    </div>
  );
}

ButtonGrid.propTypes = {
  onDigit: PropTypes.func.isRequired,
  onOperator: PropTypes.func.isRequired,
  onEquals: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDecimal: PropTypes.func.isRequired,
};

export default ButtonGrid;
