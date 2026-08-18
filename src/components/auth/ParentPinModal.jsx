import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../hooks/useAudio';
import Modal from '../ui/Modal/Modal';
import Button from '../ui/Button/Button';
import './ParentPinModal.css';

export function ParentPinModal({ isOpen, onClose, onSuccess }) {
  const { authenticateParent } = useAuth();
  const { t } = useLanguage();
  const { playSfx } = useAudio();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setError(false);
      setTimeout(() => {
        if (inputsRef.current[0]) inputsRef.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    setError(false);

    if (cleanValue && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    const fullPin = newDigits.join('');
    if (fullPin.length === 4 && newDigits.every(d => d !== '')) {
      handleVerify(fullPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (pinToVerify) => {
    const pin = pinToVerify || digits.join('');
    const isValid = await authenticateParent(pin);
    if (isValid) {
      playSfx('reward');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      playSfx('click');
      setError(true);
      setDigits(['', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('enter_parent_pin')}
      emoji="🔐"
      showClose={true}
    >
      <div className="pin-modal-card">
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {t('enter_pin_desc')}
        </p>

        <div className="pin-inputs-row">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="pin-digit-input"
              aria-label={`PIN Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="pin-error-text">
            ⚠️ {t('pin_error')}
          </p>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleVerify()}
            disabled={digits.some(d => d === '')}
          >
            {t('unlock_dashboard')}
          </Button>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
        </div>

        <p className="pin-hint">
          💡 {t('default_pin_hint')}
        </p>
      </div>
    </Modal>
  );
}

export function ParentGatewayScreen({ onUnlocked, onCancel }) {
  const { t } = useLanguage();
  return (
    <div className="parent-gateway-screen">
      <div className="parent-gateway-box anim-slide-up">
        <div style={{ fontSize: '56px', marginBottom: 'var(--space-3)' }}>🔐</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          {t('enter_parent_pin')}
        </h1>
        <ParentPinModal
          isOpen={true}
          onClose={onCancel}
          onSuccess={onUnlocked}
        />
      </div>
    </div>
  );
}

export default ParentPinModal;
