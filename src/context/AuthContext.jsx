import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import authRepository from '../services/authRepository';

const AuthContext = createContext(null);

const DEFAULT_PIN = '1234';

export function AuthProvider({ children }) {
  const [parentPin, setParentPinState] = useState(() => {
    try {
      return localStorage.getItem('kidora_parent_pin') || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  const [isParentAuthenticated, setIsParentAuthenticated] = useState(() => {
    try {
      const sessionAuth = sessionStorage.getItem('kidora_parent_auth');
      return sessionAuth === 'true';
    } catch {
      return false;
    }
  });

  const verifyPin = useCallback(async (inputPin) => {
    const res = await authRepository.verifyPin(inputPin);
    return res.success;
  }, []);

  const authenticateParent = useCallback(async (inputPin) => {
    const isValid = await verifyPin(inputPin);
    if (isValid) {
      setIsParentAuthenticated(true);
      try {
        sessionStorage.setItem('kidora_parent_auth', 'true');
      } catch (e) {
        console.warn('Session storage write error', e);
      }
      return true;
    }
    return false;
  }, [verifyPin]);

  const lockParentSession = useCallback(() => {
    setIsParentAuthenticated(false);
    try {
      sessionStorage.removeItem('kidora_parent_auth');
    } catch (e) {
      console.warn('Session storage remove error', e);
    }
  }, []);

  const changePin = useCallback(async (newPin) => {
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
      const res = await authRepository.updatePin(newPin);
      if (res.success) {
        setParentPinState(newPin);
        return { success: true };
      }
      return { success: false, message: res.message };
    }
    return { success: false, message: 'PIN must be exactly 4 digits' };
  }, []);

  const value = useMemo(() => ({
    isParentAuthenticated,
    parentPin,
    verifyPin,
    authenticateParent,
    lockParentSession,
    changePin,
  }), [isParentAuthenticated, parentPin, verifyPin, authenticateParent, lockParentSession, changePin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
