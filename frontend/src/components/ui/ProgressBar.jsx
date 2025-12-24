import './ProgressBar.css';

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  animated = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = [
    'progress-container',
    `progress-${size}`,
    className
  ].filter(Boolean).join(' ');

  const barClasses = [
    'progress-bar',
    `progress-bar-${variant}`,
    animated ? 'progress-bar-animated' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(showLabel || label) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showLabel && <span className="progress-value">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
        <div 
          className={barClasses}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
