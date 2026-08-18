import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  emoji,
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'kidora-btn',
    `kidora-btn--${variant}`,
    size !== 'md' && `kidora-btn--${size}`,
    fullWidth && 'kidora-btn--full',
    iconOnly && 'kidora-btn--icon',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {emoji && <span className="kidora-btn__emoji">{emoji}</span>}
      {icon && <span className="kidora-btn__icon">{icon}</span>}
      {children}
    </button>
  );
}
