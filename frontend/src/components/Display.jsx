import PropTypes from 'prop-types';

/**
 * Displays the current calculator value or an error message.
 * @param {Object} props
 * @param {string} props.value - The numeric string to display.
 * @param {string|null} [props.error] - Error message; shown in red when set.
 */
function Display({ value, error }) {
  return (
    <div className="calc-display" role="status" aria-live="polite">
      {error ? (
        <span className="calc-display__error">{error}</span>
      ) : (
        <span className="calc-display__value">{value}</span>
      )}
    </div>
  );
}

Display.propTypes = {
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
};

Display.defaultProps = {
  error: null,
};

export default Display;
