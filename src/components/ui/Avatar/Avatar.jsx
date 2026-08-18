import './Avatar.css';

export default function Avatar({
  src,
  emoji,
  name,
  size = 'md',
  level,
  showBorder = false,
  status,
  className = '',
}) {
  const classes = [
    'kidora-avatar',
    `kidora-avatar--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} title={name}>
      {showBorder && <span className="kidora-avatar__border" />}
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="kidora-avatar__image" />
      ) : (
        emoji || name?.charAt(0) || '🦁'
      )}
      {level && <span className="kidora-avatar__level">{level}</span>}
      {status && <span className={`kidora-avatar__status kidora-avatar__status--${status}`} />}
    </div>
  );
}
