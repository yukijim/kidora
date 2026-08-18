import { useState } from 'react';
import Button from '../../../components/ui/Button/Button';
import Avatar from '../../../components/ui/Avatar/Avatar';
import Modal from '../../../components/ui/Modal/Modal';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import '../ParentStyles.css';

function Toggle({ active, onChange }) {
  return (
    <button
      className={`toggle ${active ? 'toggle--active' : ''}`}
      onClick={() => onChange(!active)}
      aria-label="Toggle"
    >
      <span className="toggle__knob" />
    </button>
  );
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const { parentPin, changePin } = useAuth();
  const { child, updateChildProfile } = useLearning();
  const { isSoundEnabled, toggleSound, playSfx } = useAudio();

  const [notifications, setNotifications] = useState(true);
  const [dailyReport, setDailyReport] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  const [childName, setChildName] = useState(child.name);
  const [childAge, setChildAgeState] = useState(child.age);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');
  const [pinError, setPinError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    playSfx('reward');
    updateChildProfile({ name: childName, age: Number(childAge) });
    setShowEditModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (newPinValue.length !== 4) {
      setPinError(t('pin_error'));
      return;
    }
    const result = changePin(newPinValue);
    if (result.success) {
      playSfx('reward');
      setShowPinModal(false);
      setNewPinValue('');
      setPinError('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setPinError(result.message || 'Error');
    }
  };

  const handleToggleSound = (enabled) => {
    toggleSound(enabled);
    if (enabled) playSfx('reward');
  };

  const handleAgeSelect = (ageVal) => {
    const ageNum = Number(ageVal);
    setChildAgeState(ageNum);
    updateChildProfile({ age: ageNum });
    playSfx('click');
  };

  return (
    <div className="parent-page" style={{ maxWidth: 'var(--container-lg)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>
          {t('settings_title')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {t('settings_subtitle', { name: child.name })}
        </p>
      </div>

      {saveSuccess && (
        <div style={{
          background: 'var(--color-secondary-bg)',
          color: 'var(--color-secondary-dark)',
          border: '1px solid var(--color-secondary)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-sm)',
        }}>
          {t('settings_saved_msg')}
        </div>
      )}

      {/* Child Profile */}
      <div className="settings-section anim-slide-up">
        <h3 className="settings-section__title">{t('child_profile_sec')}</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) 0',
        }}>
          <Avatar emoji={child.avatar} size="lg" level={child.level} showBorder />
          <div>
            <p style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-lg)' }}>{child.name}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              {t('designed_age')}: {child.age} Years • {t('level')} {child.level} • Stars: {child.stars} ⭐
            </p>
          </div>
          <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={() => { playSfx('click'); setShowEditModal(true); }}>
            {t('edit_profile_title')}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section anim-slide-up-delay-1">
        <h3 className="settings-section__title">{t('notifications_sec')}</h3>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('push_notifications')}</p>
            <p className="settings-field__desc">{t('push_notifications_desc')}</p>
          </div>
          <Toggle active={notifications} onChange={(v) => { playSfx('click'); setNotifications(v); }} />
        </div>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('daily_report')}</p>
            <p className="settings-field__desc">{t('daily_report_desc')}</p>
          </div>
          <Toggle active={dailyReport} onChange={(v) => { playSfx('click'); setDailyReport(v); }} />
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="settings-section anim-slide-up-delay-2">
        <h3 className="settings-section__title">{t('learning_prefs_sec')}</h3>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('sound_effects')}</p>
            <p className="settings-field__desc">{t('sound_effects_desc')}</p>
          </div>
          <Toggle active={isSoundEnabled} onChange={handleToggleSound} />
        </div>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('safe_mode')}</p>
            <p className="settings-field__desc">{t('safe_mode_desc')}</p>
          </div>
          <Toggle active={safeMode} onChange={(v) => { playSfx('click'); setSafeMode(v); }} />
        </div>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('target_age_group')}</p>
            <p className="settings-field__desc">{t('target_age_desc')}</p>
          </div>
          <select
            value={child.age}
            onChange={(e) => handleAgeSelect(e.target.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--color-primary)',
              background: 'var(--color-primary-bg)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--weight-bold)',
              cursor: 'pointer',
            }}
          >
            <option value={4}>4 Years Old</option>
            <option value={5}>5 Years Old</option>
            <option value={6}>6 Years Old</option>
            <option value={7}>7 Years Old</option>
          </select>
        </div>
      </div>

      {/* Account & Security */}
      <div className="settings-section anim-slide-up-delay-3">
        <h3 className="settings-section__title">{t('account_sec')}</h3>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('parent_pin')}</p>
            <p className="settings-field__desc">{t('parent_pin_desc')} (Current: ••••)</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { playSfx('click'); setShowPinModal(true); }}>
            {t('set_pin_title')}
          </Button>
        </div>
        <div className="settings-field">
          <div>
            <p className="settings-field__label">{t('subscription_plan')}</p>
            <p className="settings-field__desc">{t('subscription_desc')}</p>
          </div>
          <span style={{
            background: 'var(--color-secondary-bg)',
            color: 'var(--color-secondary-dark)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-sm)',
          }}>
            {t('free_explorer_tier')}
          </span>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: 'var(--space-6) 0',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-xs)',
      }}>
        <p>KIDORA v1.0.0 • {t('made_for_malaysia')} • {t('all_rights_reserved')}</p>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t('edit_profile_title')}
        emoji="🦁"
      >
        <form onSubmit={handleSaveProfile} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
              Child's Name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-base)',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{ display: 'block', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
              Age
            </label>
            <select
              value={childAge}
              onChange={(e) => setChildAgeState(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-base)',
              }}
            >
              <option value={4}>4 Years Old</option>
              <option value={5}>5 Years Old</option>
              <option value={6}>6 Years Old</option>
              <option value={7}>7 Years Old</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => setShowEditModal(false)}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('save_changes')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change PIN Modal */}
      <Modal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        title={t('set_pin_title')}
        emoji="🔐"
      >
        <form onSubmit={handleSavePin} style={{ textAlign: 'left' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            {t('enter_pin_desc')}
          </p>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={newPinValue}
              onChange={(e) => setNewPinValue(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                padding: '12px',
                textAlign: 'center',
                letterSpacing: '8px',
                fontSize: 'var(--text-2xl)',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-primary)',
              }}
              required
            />
          </div>
          {pinError && (
            <p style={{ color: 'var(--color-pink-dark)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
              ⚠️ {pinError}
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="ghost" type="button" onClick={() => setShowPinModal(false)}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('save_pin')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
