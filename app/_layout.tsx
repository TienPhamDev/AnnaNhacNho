import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { setupNotificationHandler } from '../src/notifications';
import { syncAllReminders } from '../src/reminderService';
import { SettingsProvider } from '../src/SettingsContext';
import { DATABASE_NAME, migrateDatabase } from '../src/db/database';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

setupNotificationHandler();

// Mỗi lần mở app, đồng bộ lại thông báo theo dữ liệu trong SQLite
function NotificationSync() {
  const db = useSQLiteContext();
  useEffect(() => {
    syncAllReminders(db).catch(() => {});
  }, [db]);
  return null;
}

export default function RootLayout() {
  // Chờ font tải xong rồi mới hiện giao diện
  const [loaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  if (!loaded) return null;

  // SQLiteProvider mở database và chạy migrate trước khi hiện màn hình
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase}>
      <SettingsProvider>
        <NotificationSync />
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </SQLiteProvider>
  );
}
