import './Card.css';

export default function Card({
  children,
  variant,
  size,
  interactive = false,
  glow,
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'kidora-card',
    variant && `kidora-card--${variant}`,
    size && `kidora-card--${size}`,
    interactive && 'kidora-card--interactive',
    glow && `kidora-card--glow-${glow}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/* Sub-components */
export function CardHeader({ children, className = '' }) {
  return <div className={`kidora-card__header ${className}`}>{children}</div>;
}

export function CardEmoji({ children }) {
  return <span className="kidora-card__emoji">{children}</span>;
}

export function CardTitle({ children, subtitle }) {
  return (
    <div>
      <h3 className="kidora-card__title">{children}</h3>
      {subtitle && <p className="kidora-card__subtitle">{subtitle}</p>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`kidora-card__body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`kidora-card__footer ${className}`}>{children}</div>;
}
