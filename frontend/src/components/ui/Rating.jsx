import React from 'react';

const Rating = ({ 
  value = 0, 
  max = 5, 
  showValue = true,
  size = 'md',
  count,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(value)) {
      stars.push('full');
    } else if (i === Math.ceil(value) && value % 1 !== 0) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`rating ${sizeClasses[size]}`}>
        {stars.map((type, index) => (
          <span key={index} className="star">
            {type === 'full' && '★'}
            {type === 'half' && '☆'}
            {type === 'empty' && '☆'}
          </span>
        ))}
      </div>
      {showValue && (
        <span className={`font-semibold text-gray-700 ${sizeClasses[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
      {count && (
        <span className={`text-gray-500 ${sizeClasses[size]}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default Rating;
