// Thứ trong tuần của app: 0 = T2 ... 6 = CN (khác Date.getDay(): 0 = CN)
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// 7 ngày (T2..CN) của tuần chứa `date`
export function weekDates(date: Date): Date[] {
  const monday = addDays(date, -weekdayIndex(date));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKDAY_FULL = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

// "Thứ Tư, 28 tháng 10"
export function formatLongDate(date: Date): string {
  return `${WEEKDAY_FULL[weekdayIndex(date)]}, ${date.getDate()} tháng ${date.getMonth() + 1}`;
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
