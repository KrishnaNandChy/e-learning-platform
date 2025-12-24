import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './Alert.css';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const Alert = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon = true,
  className = '',
  ...props
}) => {
  const IconComponent = icon === true ? iconMap[variant] : icon;

  const classes = [
    'alert',
    `alert-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert" {...props}>
      {icon && IconComponent && (
        <span className="alert-icon">
          <IconComponent size={20} />
        </span>
      )}
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <div className="alert-message">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
