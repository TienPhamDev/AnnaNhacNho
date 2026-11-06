import type { SQLiteDatabase } from 'expo-sqlite';
import type { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  childName: '',
  defaultSound: 'default',
  snoozeMinutes: 5,
};

// Giá trị lưu dạng chuỗi trong bảng key/value; khóa nào chưa có thì dùng mặc định
export async function getSettings(db: SQLiteDatabase): Promise<Settings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const snooze = Number(map.get('snoozeMinutes'));
  return {
    childName: map.get('childName') ?? DEFAULT_SETTINGS.childName,
    defaultSound: map.get('defaultSound') ?? DEFAULT_SETTINGS.defaultSound,
    snoozeMinutes: Number.isFinite(snooze) && snooze > 0 ? snooze : DEFAULT_SETTINGS.snoozeMinutes,
  };
}

// Chỉ ghi các khóa được truyền vào
export async function saveSettings(db: SQLiteDatabase, changes: Partial<Settings>) {
  await db.withTransactionAsync(async () => {
    for (const [key, value] of Object.entries(changes)) {
      await db.runAsync(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        key,
        String(value),
      );
    }
  });
}
