import { ChevronDown } from 'lucide-react';
import './Select.css';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'md',
  name,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || name;

  const containerClasses = [
    'select-container',
    fullWidth ? 'select-full' : '',
    `select-${size}`,
    error ? 'select-error' : '',
    disabled ? 'select-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="select-field"
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-icon">
          <ChevronDown size={18} />
        </span>
      </div>
      {(helperText || error) && (
        <p className={`select-helper ${error ? 'select-helper-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
