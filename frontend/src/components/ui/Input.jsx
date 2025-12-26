import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input',
    error && 'input-error',
    success && 'input-success',
    icon && iconPosition === 'left' && 'pl-12',
    icon && iconPosition === 'right' && 'pr-12',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-danger-600' : success ? 'text-success-600' : 'text-gray-500'}`}>
          {error || success || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
