import './Spinner.css';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const classes = [
    'spinner',
    `spinner-${size}`,
    `spinner-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status" aria-label="Loading" {...props}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="10"
          opacity="0.25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="60"
          className="spinner-circle"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
