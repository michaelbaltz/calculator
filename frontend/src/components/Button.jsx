import PropTypes from 'prop-types';

/**
 * A single calculator button.
 * @param {Object} props
 * @param {string} props.label - The text label displayed on the button.
 * @param {function} props.onClick - Click handler.
 * @param {'default'|'operator'|'action'|'equals'} [props.variant='default'] - Visual variant.
 */
function Button({ label, onClick, variant = 'default' }) {
  return (
    <button
      className={`calc-button calc-button--${variant}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'operator', 'action', 'equals', 'scientific']),
};

export default Button;
