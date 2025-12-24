import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  size = 'md',
  name,
  id,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const inputId = id || name;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerClasses = [
    'input-container',
    fullWidth ? 'input-full' : '',
    `input-${size}`,
    isFocused ? 'input-focused' : '',
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="input-field"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${inputId}-helper` : undefined}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="input-icon input-icon-right input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {rightIcon && type !== 'password' && (
          <span className="input-icon input-icon-right">{rightIcon}</span>
        )}
      </div>
      {(helperText || error) && (
        <p id={`${inputId}-helper`} className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
