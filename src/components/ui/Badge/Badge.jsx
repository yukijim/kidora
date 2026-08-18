import './Badge.css';

export default function Badge({
  emoji,
  label,
  description,
  unlocked = false,
  size,
  inline = false,
  interactive = false,
  onClick,
  className = '',
}) {
  const classes = [
    'kidora-badge',
    unlocked ? 'kidora-badge--unlocked' : 'kidora-badge--locked',
    size && `kidora-badge--${size}`,
    inline && 'kidora-badge--inline',
    interactive && 'kidora-badge--interactive',
    className,
  ].filter(Boolean).join(' ');

  if (inline) {
    return (
      <div className={classes} onClick={interactive ? onClick : undefined}>
        <div className="kidora-badge__icon">
          {emoji}
          {!unlocked && <span className="kidora-badge__lock">🔒</span>}
        </div>
        <div className="kidora-badge__info">
          <span className="kidora-badge__label">{label}</span>
          {description && <p className="kidora-badge__description">{description}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={classes} onClick={interactive ? onClick : undefined}>
      <div className="kidora-badge__icon">
        {emoji}
        {!unlocked && <span className="kidora-badge__lock">🔒</span>}
      </div>
      <span className="kidora-badge__label">{label}</span>
      {description && <p className="kidora-badge__description">{description}</p>}
    </div>
  );
}
