import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'kidora_access_v1';
const AccessContext = createContext(null);

export function AccessProvider({ children }) {
  const [access, setAccess] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (access) localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan */
    }
  }, [access]);

  const unlock = (code, games, packageId) => {
    setAccess({ code, games, package: packageId, unlockedAt: Date.now() });
  };

  const lock = () => setAccess(null);

  const hasAccess = (gameId) => !!access && Array.isArray(access.games) && access.games.includes(gameId);

  return (
    <AccessContext.Provider value={{ access, unlock, lock, hasAccess }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
