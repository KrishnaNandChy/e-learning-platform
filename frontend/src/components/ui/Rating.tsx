'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const displayValue = hoverValue !== null ? hoverValue : value;
          const isFilled = starValue <= displayValue;
          const isPartial = starValue > Math.floor(displayValue) && starValue < Math.ceil(displayValue) + 1;
          const fillPercentage = isPartial ? (displayValue - Math.floor(displayValue)) * 100 : 0;

          return (
            <button
              key={index}
              type="button"
              className={clsx(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverValue(starValue)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              disabled={!interactive}
            >
              <Star
                className={clsx(
                  sizes[size],
                  isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                )}
              />
              {isPartial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={clsx(sizes[size], 'text-yellow-400 fill-yellow-400')} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
};

export default Rating;
