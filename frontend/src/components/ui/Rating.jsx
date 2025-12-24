import { Star } from 'lucide-react';
import './Rating.css';

const Rating = ({
  value = 0,
  max = 5,
  size = 'md',
  showValue = false,
  showCount = false,
  count = 0,
  readonly = true,
  onChange,
  className = '',
  ...props
}) => {
  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const classes = [
    'rating',
    `rating-${size}`,
    !readonly ? 'rating-interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="rating-stars">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(value);
          const isHalfFilled = !isFilled && starValue - 0.5 <= value;

          return (
            <button
              key={index}
              type="button"
              className={`rating-star ${isFilled ? 'rating-star-filled' : ''} ${isHalfFilled ? 'rating-star-half' : ''}`}
              onClick={() => handleClick(starValue)}
              disabled={readonly}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star />
              {isHalfFilled && (
                <Star className="rating-star-half-overlay" />
              )}
            </button>
          );
        })}
      </div>
      {(showValue || showCount) && (
        <span className="rating-info">
          {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
          {showCount && <span className="rating-count">({count.toLocaleString()})</span>}
        </span>
      )}
    </div>
  );
};

export default Rating;
