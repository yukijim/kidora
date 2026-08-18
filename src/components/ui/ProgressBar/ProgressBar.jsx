import './ProgressBar.css';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'blue',
  size,
  milestones,
  variant,
  className = '',
}) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const classes = [
    'kidora-progress',
    `kidora-progress--${color}`,
    size && `kidora-progress--${size}`,
    variant && `kidora-progress--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(label || showValue) && (
        <div className="kidora-progress__label">
          {label && <span className="kidora-progress__text">{label}</span>}
          {showValue && (
            <span className="kidora-progress__value">{percentage}%</span>
          )}
        </div>
      )}
      <div className="kidora-progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className="kidora-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {milestones && (
        <div className="kidora-progress__milestones">
          {milestones.map((milestone, index) => {
            const milestonePercent = ((index + 1) / milestones.length) * 100;
            return (
              <span
                key={index}
                className={`kidora-progress__milestone ${percentage >= milestonePercent ? 'kidora-progress__milestone--reached' : ''}`}
              >
                ⭐
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
