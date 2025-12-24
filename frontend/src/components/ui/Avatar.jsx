import React from 'react';

const Avatar = ({ 
  src, 
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  const classes = [
    'avatar',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  const fallbackClasses = [
    'avatar bg-primary-100 text-primary-700 flex items-center justify-center font-semibold',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  if (!src && fallback) {
    return (
      <div className={fallbackClasses} {...props}>
        {fallback}
      </div>
    );
  }

  return (
    <img 
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=0ea5e9&color=fff`} 
      alt={alt} 
      className={classes}
      {...props}
    />
  );
};

export default Avatar;
