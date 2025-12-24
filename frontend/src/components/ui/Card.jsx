import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable ? 'card-hoverable' : '',
    clickable ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Header
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

// Card Body
const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer
const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// Card Image
const CardImage = ({ src, alt, aspectRatio = '16/9', className = '', ...props }) => (
  <div className={`card-image ${className}`} style={{ aspectRatio }} {...props}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
