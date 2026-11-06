import type { SQLiteDatabase } from 'expo-sqlite';

// Ngày dạng YYYY-MM-DD theo giờ máy
function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

// Con bấm "Con học ngay!": ghi lại là đã học lịch nhắc này hôm nay
export async function markStudied(db: SQLiteDatabase, reminderId: number, when = new Date()) {
  await db.runAsync(
    'INSERT INTO study_logs (reminder_id, day, done_at) VALUES (?, ?, ?)',
    reminderId,
    dayKey(when),
    when.getTime(),
  );
}
