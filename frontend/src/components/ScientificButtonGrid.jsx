import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Renders the scientific function button grid in a 2-column layout.
 * Layout:
 *   [ n! ] [ ln  ]
 *   [ log] [ eˣ  ]
 *   [ xʸ ] [ logₙ]
 *
 * @param {Object} props
 * @param {function(string): Promise<void>} props.onUnary - Called with a unary operation name.
 * @param {function(string): void} props.onBinary - Called with a binary operation name.
 */
function ScientificButtonGrid({ onUnary, onBinary }) {
  return (
    <div className="calc-scientific-grid">
      <Button label="n!" onClick={() => onUnary('factorial')} variant="scientific" />
      <Button label="ln" onClick={() => onUnary('log')} variant="scientific" />
      <Button label="log" onClick={() => onUnary('log10')} variant="scientific" />
      <Button label="eˣ" onClick={() => onUnary('exp')} variant="scientific" />
      <Button label="xʸ" onClick={() => onBinary('power')} variant="scientific" />
      <Button label="logₙ" onClick={() => onBinary('log_base')} variant="scientific" />
    </div>
  );
}

ScientificButtonGrid.propTypes = {
  onUnary: PropTypes.func.isRequired,
  onBinary: PropTypes.func.isRequired,
};

export default ScientificButtonGrid;
