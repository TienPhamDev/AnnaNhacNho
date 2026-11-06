import type { SQLiteDatabase } from 'expo-sqlite';
import type { Reminder, ReminderInput } from '../types';

// Dòng thô trong bảng reminders
type Row = {
  id: number;
  title: string;
  subject: Reminder['subject'];
  hour: number;
  minute: number;
  weekdays: string;
  message: string;
  photo_uri: string | null;
  sound: string;
  duration_min: number;
  enabled: number;
  notification_ids: string;
};

function toReminder(r: Row): Reminder {
  return {
    id: r.id,
    title: r.title,
    subject: r.subject,
    hour: r.hour,
    minute: r.minute,
    weekdays: JSON.parse(r.weekdays),
    message: r.message,
    photoUri: r.photo_uri,
    sound: r.sound,
    durationMin: r.duration_min,
    enabled: r.enabled === 1,
    notificationIds: JSON.parse(r.notification_ids),
  };
}

// Sắp xếp theo giờ trong ngày
export async function getReminders(db: SQLiteDatabase): Promise<Reminder[]> {
  const rows = await db.getAllAsync<Row>('SELECT * FROM reminders ORDER BY hour, minute, id');
  return rows.map(toReminder);
}

export async function getReminder(db: SQLiteDatabase, id: number): Promise<Reminder | null> {
  const row = await db.getFirstAsync<Row>('SELECT * FROM reminders WHERE id = ?', id);
  return row ? toReminder(row) : null;
}

// Trả về id của lịch nhắc vừa tạo
export async function addReminder(db: SQLiteDatabase, input: ReminderInput): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO reminders (title, subject, hour, minute, weekdays, message, photo_uri, sound, duration_min, enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    input.title,
    input.subject,
    input.hour,
    input.minute,
    JSON.stringify(input.weekdays),
    input.message,
    input.photoUri,
    input.sound,
    input.durationMin,
    input.enabled ? 1 : 0,
  );
  return result.lastInsertRowId;
}

export async function updateReminder(db: SQLiteDatabase, id: number, input: ReminderInput) {
  await db.runAsync(
    `UPDATE reminders SET title = ?, subject = ?, hour = ?, minute = ?, weekdays = ?, message = ?,
       photo_uri = ?, sound = ?, duration_min = ?, enabled = ? WHERE id = ?`,
    input.title,
    input.subject,
    input.hour,
    input.minute,
    JSON.stringify(input.weekdays),
    input.message,
    input.photoUri,
    input.sound,
    input.durationMin,
    input.enabled ? 1 : 0,
    id,
  );
}

export async function setReminderEnabled(db: SQLiteDatabase, id: number, enabled: boolean) {
  await db.runAsync('UPDATE reminders SET enabled = ? WHERE id = ?', enabled ? 1 : 0, id);
}

// Lưu id thông báo đã lên lịch để hủy được về sau (không để thông báo "mồ côi")
export async function setNotificationIds(db: SQLiteDatabase, id: number, ids: string[]) {
  await db.runAsync('UPDATE reminders SET notification_ids = ? WHERE id = ?', JSON.stringify(ids), id);
}

export async function deleteReminder(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM reminders WHERE id = ?', id);
}
