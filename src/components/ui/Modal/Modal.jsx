import { useEffect, useCallback } from 'react';
import './Modal.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  emoji,
  children,
  celebration = false,
  points,
  showClose = true,
  className = '',
}) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalClasses = [
    'kidora-modal',
    celebration && 'kidora-modal--celebration',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="kidora-modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget && onClose) onClose();
    }}>
      <div className={modalClasses} role="dialog" aria-modal="true" aria-label={title}>
        {showClose && (
          <button className="kidora-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}

        <div className="kidora-modal__header">
          {emoji && <span className="kidora-modal__emoji">{emoji}</span>}
          {points && <span className="kidora-modal__points">+{points} ⭐</span>}
          {title && <h2 className="kidora-modal__title">{title}</h2>}
        </div>

        <div className="kidora-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}
