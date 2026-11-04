import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// Lấy id lịch nhắc đính kèm trong thông báo (xem notifications.ts)
function reminderIdOf(notification: Notifications.Notification): number | null {
  const id = Number(notification.request.content.data?.reminderId);
  return Number.isFinite(id) ? id : null;
}

// Mở màn "Đến giờ học" khi: con bấm vào thông báo (kể cả khi app đang đóng),
// hoặc thông báo đến lúc app đang mở.
export function NotificationRouter() {
  const router = useRouter();
  const lastResponse = Notifications.useLastNotificationResponse();

  const openAlarm = (id: number) => router.push({ pathname: '/alarm', params: { id: String(id) } });

  // Bấm vào thông báo
  useEffect(() => {
    if (!lastResponse) return;
    const id = reminderIdOf(lastResponse.notification);
    if (id !== null) openAlarm(id);
    // Xóa để không mở lại lần nữa khi màn hình render lại
    Notifications.clearLastNotificationResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResponse]);

  // Thông báo đến khi app đang mở
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const id = reminderIdOf(notification);
      if (id !== null) openAlarm(id);
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
