import './ResponsiveContainer.css';

export default function ResponsiveContainer({ children, size, flush = false, className = '' }) {
  const classes = [
    'container',
    size && `container--${size}`,
    flush && 'container--flush',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

export function PageTitle({ children, subtitle, emoji }) {
  return (
    <div className="page-title">
      <h1 className="page-title__text">
        {emoji && <span>{emoji} </span>}
        {children}
      </h1>
      {subtitle && <p className="page-title__sub">{subtitle}</p>}
    </div>
  );
}

export function Section({ title, emoji, action, onAction, children, className = '' }) {
  return (
    <section className={`section ${className}`}>
      {title && (
        <div className="section__header">
          <h2 className="section__title">
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          {action && (
            <button className="section__action" onClick={onAction}>
              {action}
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
