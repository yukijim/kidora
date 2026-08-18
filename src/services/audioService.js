/* ============================================
   KIDORA — Audio & Sound FX Service
   Architecture for Web Audio SFX + Voice-Over
   Includes synthetic fallback chimes when audio files are not present
   ============================================ */

class AudioService {
  constructor() {
    this.soundEnabled = true;
    this.audioContext = null;
    this.soundCache = {};

    // Load initial sound preferences from storage if available
    try {
      const saved = localStorage.getItem('kidora_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = JSON.parse(saved);
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('kidora_sound_enabled', JSON.stringify(enabled));
    } catch (e) {
      console.warn('Could not persist sound setting', e);
    }
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  _getAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /* Synthetic Web Audio Chimes for immediate feedback without asset dependency */
  _playSyntheticSound(type) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'reward' || type === 'celebration') {
        // Multi-tone cheerful chime (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, now + i * 0.08);
          noteGain.gain.setValueAtTime(0.2, now + i * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.start(now + i * 0.08);
          noteOsc.stop(now + i * 0.08 + 0.35);
        });
      } else if (type === 'step') {
        // Pop sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'badge_unlock') {
        // Grand fanfare chime
        const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        fanfare.forEach((freq, i) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(freq, now + i * 0.1);
          noteGain.gain.setValueAtTime(0.25, now + i * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.start(now + i * 0.1);
          noteOsc.stop(now + i * 0.1 + 0.45);
        });
      }
    } catch (e) {
      // Audio playback silently catches user gesture restrictions
      console.debug('Audio playback note:', e);
    }
  }

  /**
   * Play SFX by identifier
   * @param {'click'|'reward'|'celebration'|'step'|'badge_unlock'} sfxName
   * @param {string} [customAssetUrl] Optional real audio file path
   */
  playSfx(sfxName, customAssetUrl) {
    if (!this.soundEnabled) return;

    if (customAssetUrl) {
      try {
        const audio = new Audio(customAssetUrl);
        audio.play().catch(() => {
          this._playSyntheticSound(sfxName);
        });
        return;
      } catch {
        this._playSyntheticSound(sfxName);
      }
    }

    this._playSyntheticSound(sfxName);
  }

  /**
   * Voice-Over trigger abstraction
   * @param {string} voiceKey e.g. 'greeting', 'cheer', 'well_done'
   * @param {string} [voiceUrl]
   */
  playVoiceOver(voiceKey, voiceUrl) {
    if (!this.soundEnabled) return;
    if (voiceUrl) {
      try {
        const audio = new Audio(voiceUrl);
        audio.play().catch(e => console.debug('Voice over notice:', e));
      } catch (e) {
        console.debug('Voice over error:', e);
      }
    }
  }
}

export const audioService = new AudioService();
export default audioService;
