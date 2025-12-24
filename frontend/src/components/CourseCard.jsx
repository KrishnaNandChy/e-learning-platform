import { Link } from 'react-router-dom';
import { Clock, Users, BarChart, Heart } from 'lucide-react';
import { Card, Badge, Rating, Avatar } from './ui';
import './CourseCard.css';

const CourseCard = ({ 
  course, 
  variant = 'default',
  showInstructor = true,
  onClick 
}) => {
  const {
    _id,
    id,
    title,
    description,
    thumbnail,
    instructor,
    price,
    originalPrice,
    rating = 4.5,
    reviewCount = 0,
    studentsEnrolled = 0,
    duration,
    level = 'Beginner',
    category,
    isBestseller,
    isNew,
  } = course;

  const courseId = _id || id;
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  const CardWrapper = onClick ? 'div' : Link;
  const cardProps = onClick 
    ? { onClick, className: 'course-card-link' }
    : { to: `/courses/${courseId}`, className: 'course-card-link' };

  return (
    <Card 
      className={`course-card course-card-${variant}`} 
      hoverable
      padding="none"
    >
      <CardWrapper {...cardProps}>
        {/* Thumbnail */}
        <div className="course-card-thumbnail">
          <img 
            src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
            alt={title}
            loading="lazy"
          />
          <button 
            className="course-card-wishlist" 
            onClick={(e) => e.preventDefault()}
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
          {(isBestseller || isNew) && (
            <div className="course-card-badges">
              {isBestseller && <Badge variant="warning" size="sm">Bestseller</Badge>}
              {isNew && <Badge variant="success" size="sm">New</Badge>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="course-card-content">
          {/* Category */}
          {category && (
            <span className="course-card-category">{category}</span>
          )}

          {/* Title */}
          <h3 className="course-card-title">{title}</h3>

          {/* Description (for larger variants) */}
          {variant === 'featured' && description && (
            <p className="course-card-description">{description}</p>
          )}

          {/* Meta info */}
          <div className="course-card-meta">
            <span className="course-card-meta-item">
              <Clock size={14} />
              {duration || '10h 30m'}
            </span>
            <span className="course-card-meta-item">
              <BarChart size={14} />
              {level}
            </span>
            {studentsEnrolled > 0 && (
              <span className="course-card-meta-item">
                <Users size={14} />
                {studentsEnrolled.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="course-card-rating">
            <Rating value={rating} size="sm" showValue showCount count={reviewCount} />
          </div>

          {/* Instructor */}
          {showInstructor && instructor && (
            <div className="course-card-instructor">
              <Avatar 
                name={instructor.name || instructor} 
                src={instructor.avatar}
                size="xs" 
              />
              <span>{instructor.name || instructor}</span>
            </div>
          )}

          {/* Price */}
          <div className="course-card-price">
            <span className="course-card-price-current">
              {price === 0 ? 'Free' : `₹${price?.toLocaleString() || '999'}`}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="course-card-price-original">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <Badge variant="success" size="sm">{discount}% off</Badge>
              </>
            )}
          </div>
        </div>
      </CardWrapper>
    </Card>
  );
};

export default CourseCard;
