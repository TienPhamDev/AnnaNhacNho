// Môn học quyết định icon + màu của lịch nhắc
export type Subject = 'math' | 'vietnamese' | 'reading' | 'other';

export type Reminder = {
  id: number;
  title: string;
  subject: Subject;
  hour: number; // 0-23
  minute: number; // 0-59
  weekdays: number[]; // 0-6 (0 = T2 ... 6 = CN)
  message: string;
  photoUri: string | null;
  sound: string;
  durationMin: number;
  enabled: boolean;
  // Id các thông báo đã lên lịch, để hủy khi sửa / tắt / xóa
  notificationIds: string[];
};

// Dữ liệu khi tạo mới / sửa (chưa có id, notificationIds do lớp thông báo quản lý)
export type ReminderInput = Omit<Reminder, 'id' | 'notificationIds'>;

export type Settings = {
  childName: string;
  defaultSound: string;
  snoozeMinutes: number;
};
