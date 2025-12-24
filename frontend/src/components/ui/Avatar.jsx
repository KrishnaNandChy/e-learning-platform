import './Avatar.css';

const Avatar = ({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  ...props
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const classes = [
    'avatar',
    `avatar-${size}`,
    `avatar-${shape}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {src ? (
        <img src={src} alt={alt || name} className="avatar-image" />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
      {status && <span className={`avatar-status avatar-status-${status}`} />}
    </div>
  );
};

// Avatar Group
const AvatarGroup = ({ children, max = 4, size = 'md', className = '' }) => {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={`avatar-group ${className}`}>
      {visibleAvatars}
      {remainingCount > 0 && (
        <div className={`avatar avatar-${size} avatar-circle avatar-overflow`}>
          <span className="avatar-initials">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

Avatar.Group = AvatarGroup;

export default Avatar;
