import type { ComponentType } from 'react';
import { AlarmClock, BookOpen, Calculator, NotebookPen } from 'lucide-react-native';
import { colors } from './theme';
import { homeStrings } from './strings';
import { weekdayIndex } from './dateUtils';
import type { Reminder, Subject } from './types';

type IconType = ComponentType<{ size?: number; color?: string }>;

// Môn học quyết định icon, màu nền và lời động viên
export const SUBJECTS: Record<Subject, { Icon: IconType; background: string; cheer: string }> = {
  math: { Icon: Calculator, background: colors.orangeSoft, cheer: homeStrings.cheer.math },
  vietnamese: { Icon: NotebookPen, background: colors.primarySoft, cheer: homeStrings.cheer.vietnamese },
  reading: { Icon: BookOpen, background: colors.greenSoft, cheer: homeStrings.cheer.reading },
  other: { Icon: AlarmClock, background: colors.yellowSoft, cheer: homeStrings.cheer.other },
};

export const SUBJECT_ORDER: Subject[] = ['math', 'vietnamese', 'reading', 'other'];

// Đoán môn từ tên lịch nhắc để tự chọn icon (phụ huynh vẫn đổi tay được)
export function detectSubject(title: string): Subject {
  const t = title.toLowerCase();
  if (t.includes('toán')) return 'math';
  if (/tiếng việt|chính tả|tập viết|văn/.test(t)) return 'vietnamese';
  if (/đọc|sách/.test(t)) return 'reading';
  return 'other';
}

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

// "Mỗi ngày", "Thứ 2 – Thứ 6", "Thứ 2, Thứ 4, Chủ nhật"
export function summarizeWeekdays(weekdays: number[]): string {
  const days = [...new Set(weekdays)].sort((a, b) => a - b);
  if (days.length === 0) return homeStrings.noRepeat;
  if (days.length === 7) return homeStrings.everyDay;
  const isRange = days.length >= 3 && days[days.length - 1] - days[0] === days.length - 1;
  if (isRange) return `${DAY_NAMES[days[0]]} – ${DAY_NAMES[days[days.length - 1]]}`;
  return days.map((d) => DAY_NAMES[d]).join(', ');
}

export function remindersOnDay(reminders: Reminder[], date: Date): Reminder[] {
  const day = weekdayIndex(date);
  return reminders.filter((r) => r.weekdays.includes(day));
}

// Lịch nhắc đang bật gần nhất còn lại trong hôm nay
export function findNextToday(reminders: Reminder[], now: Date): { reminder: Reminder; minutesLeft: number } | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best: { reminder: Reminder; minutesLeft: number } | null = null;
  for (const reminder of remindersOnDay(reminders, now)) {
    if (!reminder.enabled) continue;
    const minutesLeft = reminder.hour * 60 + reminder.minute - nowMinutes;
    if (minutesLeft < 0) continue;
    if (!best || minutesLeft < best.minutesLeft) best = { reminder, minutesLeft };
  }
  return best;
}

// "48 PHÚT", "1 GIỜ 5 PHÚT"
export function formatMinutesLeft(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`;
}
