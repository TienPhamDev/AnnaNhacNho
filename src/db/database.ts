import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'nhac-anna-hoc.db';

// Tăng số này và thêm một bước vào MIGRATIONS khi đổi cấu trúc bảng
const MIGRATIONS: string[] = [
  `
  CREATE TABLE reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'other',
    hour INTEGER NOT NULL,
    minute INTEGER NOT NULL,
    weekdays TEXT NOT NULL DEFAULT '[]',
    message TEXT NOT NULL DEFAULT '',
    photo_uri TEXT,
    sound TEXT NOT NULL DEFAULT 'default',
    duration_min INTEGER NOT NULL DEFAULT 30,
    enabled INTEGER NOT NULL DEFAULT 1,
    notification_ids TEXT NOT NULL DEFAULT '[]'
  );
  CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
  `,
];

// Dùng làm onInit của SQLiteProvider: tạo / nâng cấp bảng theo PRAGMA user_version
export async function migrateDatabase(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  if (version >= MIGRATIONS.length) return;

  await db.execAsync('PRAGMA journal_mode = WAL;');
  // Chạy các bước còn thiếu trong một giao dịch để không bị nửa chừng
  await db.withTransactionAsync(async () => {
    while (version < MIGRATIONS.length) {
      await db.execAsync(MIGRATIONS[version]);
      version += 1;
    }
    await db.execAsync(`PRAGMA user_version = ${version}`);
  });
}
