import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';
import type { Reminder } from './types';
import { notificationStrings } from './strings';

// Dữ liệu đính kèm thông báo, để biết mở "Đến giờ học" cho lịch nhắc nào
export type ReminderNotificationData = { reminderId: number; snooze?: boolean };

// Khi app đang mở: phát tiếng nhưng không hiện banner, vì app mở thẳng màn "Đến giờ học"
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function hasNotificationPermission(): Promise<boolean> {
  return (await Notifications.getPermissionsAsync()).granted;
}

// Xin quyền nếu chưa có; trả về true khi đã được cấp
export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

// Đã từ chối thì chỉ bật lại được trong Cài đặt hệ thống
export function openSystemSettings() {
  return Linking.openSettings();
}

// Thứ của app: 0 = T2 ... 6 = CN. expo-notifications: 1 = Chủ nhật ... 7 = Thứ bảy.
export function toExpoWeekday(weekday: number): number {
  return ((weekday + 1) % 7) + 1;
}

export async function cancelNotifications(ids: string[]) {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

function contentFor(reminder: Reminder, snooze = false) {
  const data: ReminderNotificationData = { reminderId: reminder.id, ...(snooze && { snooze: true }) };
  return {
    title: notificationStrings.title,
    body: reminder.message.trim() || reminder.title,
    sound: true,
    data,
  };
}

// Hủy thông báo cũ của lịch nhắc rồi lên lịch lại (một thông báo lặp hàng tuần cho mỗi thứ).
// Lịch đang tắt hoặc chưa chọn thứ nào thì chỉ hủy. Trả về id mới để lưu vào SQLite.
export async function rescheduleReminder(reminder: Reminder): Promise<string[]> {
  await cancelNotifications(reminder.notificationIds);
  if (!reminder.enabled || reminder.weekdays.length === 0) return [];

  const ids: string[] = [];
  for (const weekday of reminder.weekdays) {
    ids.push(
      await Notifications.scheduleNotificationAsync({
        content: contentFor(reminder),
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: toExpoWeekday(weekday),
          hour: reminder.hour,
          minute: reminder.minute,
        },
      }),
    );
  }
  return ids;
}

// "Nhắc lại sau N phút": một thông báo một lần, không lặp
export async function scheduleSnooze(reminder: Reminder, minutes: number): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: contentFor(reminder, true),
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: minutes * 60 },
  });
}

// Xóa mọi thông báo đã lên lịch (dùng khi đồng bộ lại từ đầu)
export function cancelAllNotifications() {
  return Notifications.cancelAllScheduledNotificationsAsync();
}

// Hủy các thông báo "nhắc lại" đang chờ của một lịch nhắc (không đụng tới thông báo hàng tuần)
export async function cancelSnoozes(reminderId: number) {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  const snoozes = pending.filter((n) => n.content.data?.snooze && Number(n.content.data?.reminderId) === reminderId);
  await Promise.all(snoozes.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}
