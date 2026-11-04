import type { SQLiteDatabase } from 'expo-sqlite';
import {
  addReminder,
  deleteReminder,
  getReminder,
  getReminders,
  setNotificationIds,
  setReminderEnabled,
  updateReminder,
} from './db/reminders';
import { cancelAllNotifications, cancelNotifications, cancelSnoozes, requestNotificationPermission, rescheduleReminder } from './notifications';
import type { Reminder, ReminderInput } from './types';

// Các màn hình chỉ gọi file này: ghi SQLite và cập nhật thông báo luôn đi cùng nhau,
// nên không bao giờ còn thông báo "mồ côi".

// Lên lịch lại thông báo của một lịch nhắc rồi lưu id mới
async function syncNotifications(db: SQLiteDatabase, reminder: Reminder) {
  const ids = await rescheduleReminder(reminder);
  await setNotificationIds(db, reminder.id, ids);
}

export async function createReminder(db: SQLiteDatabase, input: ReminderInput): Promise<number> {
  const id = await addReminder(db, input);
  // Xin quyền ngay lần đầu có lịch nhắc cần thông báo; bị từ chối vẫn lưu lịch
  if (input.enabled) await requestNotificationPermission();
  const reminder = await getReminder(db, id);
  if (reminder) await syncNotifications(db, reminder);
  return id;
}

export async function editReminder(db: SQLiteDatabase, id: number, input: ReminderInput) {
  await updateReminder(db, id, input);
  if (input.enabled) await requestNotificationPermission();
  const reminder = await getReminder(db, id);
  if (reminder) await syncNotifications(db, reminder);
}

export async function toggleReminder(db: SQLiteDatabase, id: number, enabled: boolean) {
  await setReminderEnabled(db, id, enabled);
  if (enabled) await requestNotificationPermission();
  const reminder = await getReminder(db, id);
  if (reminder) await syncNotifications(db, reminder);
}

export async function removeReminder(db: SQLiteDatabase, id: number) {
  const reminder = await getReminder(db, id);
  if (reminder) await cancelNotifications(reminder.notificationIds);
  await cancelSnoozes(id);
  await deleteReminder(db, id);
}

// Gọi khi mở app: xóa sạch rồi lên lịch lại theo dữ liệu trong SQLite,
// để thông báo luôn khớp với lịch nhắc dù có lỗi hay dữ liệu cũ.
export async function syncAllReminders(db: SQLiteDatabase) {
  await cancelAllNotifications();
  for (const reminder of await getReminders(db)) {
    await syncNotifications(db, { ...reminder, notificationIds: [] });
  }
}
