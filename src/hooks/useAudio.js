import { useState, useCallback } from 'react';
import audioService from '../services/audioService';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(!audioService.isSoundEnabled());

  const playSfx = useCallback((type, assetUrl) => {
    audioService.playSfx(type, assetUrl);
  }, []);

  const playVoiceOver = useCallback((key, assetUrl) => {
    audioService.playVoiceOver(key, assetUrl);
  }, []);

  const toggleSound = useCallback((enable) => {
    const nextState = typeof enable === 'boolean' ? enable : isMuted;
    audioService.setSoundEnabled(nextState);
    setIsMuted(!nextState);
  }, [isMuted]);

  return {
    playSfx,
    playVoiceOver,
    toggleSound,
    isSoundEnabled: !isMuted,
  };
}

export default useAudio;
