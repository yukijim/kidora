import { Link } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar/ProgressBar';
import './Ecosystem.css';

/* ---- Ecosystem Card (Learn/Play/Grow/Achieve) ---- */
export function EcoCard({ emoji, title, subtitle, tag, variant = 'learn', onClick, children }) {
  return (
    <div className={`eco-card eco-card--${variant}`} onClick={onClick} role="button" tabIndex={0}>
      <span className="eco-card__emoji">{emoji}</span>
      <h3 className="eco-card__title">{title}</h3>
      {subtitle && <p className="eco-card__subtitle">{subtitle}</p>}
      {children}
      {tag && (
        <div className="eco-card__meta">
          <span className="eco-card__tag">{tag}</span>
        </div>
      )}
    </div>
  );
}

/* ---- Learn Card ---- */
export function LearnCard({ module, onClick }) {
  const colorMap = { blue: 'blue', yellow: 'yellow', green: 'green', purple: 'purple', pink: 'pink', teal: 'teal' };

  return (
    <EcoCard
      emoji={module.emoji}
      title={module.title}
      subtitle={module.description}
      variant="learn"
      tag={module.subject}
      onClick={onClick}
    >
      <ProgressBar
        value={module.lessonsCompleted}
        max={module.lessonsTotal}
        color={colorMap[module.color] || 'blue'}
        size="sm"
        showValue={false}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          {module.lessonsCompleted}/{module.lessonsTotal} lessons
        </p>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
          {module.progress}%
        </span>
      </div>
    </EcoCard>
  );
}

/* ---- Play Card ---- */
export function PlayCard({ activity, onClick }) {
  return (
    <EcoCard
      emoji={activity.emoji}
      title={activity.title}
      subtitle={`${activity.category} • ${activity.difficulty}`}
      variant="play"
      tag={activity.category}
      onClick={onClick}
    />
  );
}

/* ---- Grow Card (Skill) ---- */
export function GrowCard({ skill, onClick }) {
  return (
    <div
      className="skill-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <span className="skill-card__emoji">{skill.emoji}</span>
      <div className="skill-card__info">
        <h4 className="skill-card__name">{skill.name}</h4>
        <span className="skill-card__level">Level {skill.level}/{skill.maxLevel}</span>
        <ProgressBar
          value={skill.progress}
          max={100}
          color={skill.color}
          size="sm"
          showValue={false}
          label=""
        />
        <div className="skill-card__stars">
          {Array.from({ length: skill.maxLevel }, (_, i) => (
            <span key={i} className={`skill-card__star ${i < skill.level ? 'skill-card__star--filled' : ''}`}>⭐</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Mission Card ---- */
export function MissionCard({ mission, onClick }) {
  const statusLabels = {
    'in-progress': 'In Progress',
    'completed': 'Completed ✓',
    'new': 'New!',
    'locked': '🔒 Locked',
  };

  return (
    <div
      className={`mission-card mission-card--${mission.status}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="mission-card__header">
        <span className="mission-card__emoji">{mission.emoji}</span>
        <div className="mission-card__info">
          <h3 className="mission-card__title">{mission.title}</h3>
          <span className={`mission-card__status mission-card__status--${mission.status}`}>
            {statusLabels[mission.status]}
          </span>
        </div>
      </div>

      {mission.status !== 'locked' && (
        <>
          <div className="mission-card__steps">
            {Array.from({ length: mission.totalSteps }, (_, i) => (
              <span key={`step-group-${i}`} style={{ display: 'contents' }}>
                <span
                  className={`mission-card__step ${
                    i < mission.progress
                      ? 'mission-card__step--completed'
                      : i === mission.progress
                      ? 'mission-card__step--current'
                      : ''
                  }`}
                >
                  {i < mission.progress ? '✓' : i + 1}
                </span>
                {i < mission.totalSteps - 1 && (
                  <span
                    className={`mission-card__step-connector ${
                      i < mission.progress ? 'mission-card__step-connector--completed' : ''
                    }`}
                  />
                )}
              </span>
            ))}
          </div>

          <div className="mission-card__xp">
            <span>⭐</span>
            <span>+{mission.xpReward} XP</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ---- Reward Badge ---- */
export function RewardBadge({ emoji, points, label, sublabel }) {
  return (
    <div className="reward-badge">
      <div className="reward-badge__circle">{emoji || '🏆'}</div>
      {points && <div className="reward-badge__points">+{points}</div>}
      <div className="reward-badge__label">{label}</div>
      {sublabel && <div className="reward-badge__sublabel">{sublabel}</div>}
    </div>
  );
}

/* ---- Ecosystem Hub (Home page grid) ---- */
export function EcosystemHub() {
  const items = [
    { id: 'learn', emoji: '📚', label: 'Learn', sublabel: 'Explore lessons', path: '/child/learn' },
    { id: 'play', emoji: '🎮', label: 'Play', sublabel: 'Fun activities', path: '/child/play' },
    { id: 'grow', emoji: '🌱', label: 'Grow', sublabel: 'Track skills', path: '/child/grow' },
    { id: 'achieve', emoji: '🏆', label: 'Achieve', sublabel: 'Earn rewards', path: '/child/achieve' },
  ];

  return (
    <div className="eco-hub">
      {items.map((item) => (
        <Link key={item.id} to={item.path} className={`eco-hub__item eco-hub__item--${item.id}`}>
          <span className="eco-hub__emoji">{item.emoji}</span>
          <span className="eco-hub__label">{item.label}</span>
          <span className="eco-hub__sublabel">{item.sublabel}</span>
        </Link>
      ))}
    </div>
  );
}
