import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'kidora_access_v1';
const DEMO_MINUTES = 10;
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
    setAccess((prev) => {
      if (packageId === 'demo') {
        // Kekalkan baki masa demo jika masih aktif (elak "sambung" demo selamanya)
        const keepExpiry =
          prev && prev.package === 'demo' && prev.demoExpiry && prev.demoExpiry > Date.now()
            ? prev.demoExpiry
            : Date.now() + DEMO_MINUTES * 60000;
        return { code, games, package: packageId, unlockedAt: Date.now(), demoExpiry: keepExpiry };
      }
      return { code, games, package: packageId, unlockedAt: Date.now() };
    });
  };

  const lock = () => setAccess(null);

  const hasAccess = (gameId) => {
    if (!access || !Array.isArray(access.games)) return false;
    if (access.package === 'demo' && access.demoExpiry && Date.now() >= access.demoExpiry) return false;
    return access.games.includes(gameId);
  };

  return (
    <AccessContext.Provider value={{ access, unlock, lock, hasAccess }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
