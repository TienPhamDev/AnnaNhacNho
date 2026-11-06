import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from './db/settings';
import type { Settings } from './types';

type Value = {
  settings: Settings;
  // Ghi xuống SQLite rồi cập nhật state để mọi màn hình đổi theo
  updateSettings: (changes: Partial<Settings>) => Promise<void>;
};

const SettingsContext = createContext<Value | null>(null);

// Phải nằm trong SQLiteProvider
export function SettingsProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings(db).then(setSettings);
  }, [db]);

  const updateSettings = useCallback(
    async (changes: Partial<Settings>) => {
      await saveSettings(db, changes);
      setSettings((prev) => ({ ...prev, ...changes }));
    },
    [db],
  );

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings phải nằm trong SettingsProvider');
  return value;
}
