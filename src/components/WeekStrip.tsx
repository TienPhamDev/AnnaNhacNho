import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { homeStrings } from '../strings';
import { WEEKDAY_SHORT, formatLongDate, isSameDay, weekDates } from '../dateUtils';

type Props = {
  selected: Date;
  hasReminder: (date: Date) => boolean;
  onSelect: (date: Date) => void;
  // iPad: có nút chuyển tuần và nút "Tuần này"
  onShiftWeek?: (days: number) => void;
  onToday?: () => void;
  wide: boolean;
};

// Ngày đang chọn + dải 7 ngày (T2..CN); chấm dưới ngày nào có lịch nhắc
export function WeekStrip({ selected, hasReminder, onSelect, onShiftWeek, onToday, wide }: Props) {
  const days = weekDates(selected);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, wide && styles.titleWide]}>{formatLongDate(selected)}</Text>
        {wide && (
          <View style={styles.weekNav}>
            <Pressable onPress={() => onShiftWeek?.(-7)} hitSlop={8} accessibilityRole="button">
              <ChevronLeft size={17} color={colors.textSecondary} />
            </Pressable>
            <Pressable onPress={onToday} hitSlop={8} accessibilityRole="button">
              <Text style={styles.weekNavText}>{homeStrings.thisWeek}</Text>
            </Pressable>
            <Pressable onPress={() => onShiftWeek?.(7)} hitSlop={8} accessibilityRole="button">
              <ChevronRight size={17} color={colors.textSecondary} />
            </Pressable>
          </View>
        )}
      </View>
      <View style={[styles.days, wide && styles.daysWide]}>
        {days.map((date, i) => {
          const active = isSameDay(date, selected);
          return (
            <Pressable
              key={i}
              onPress={() => onSelect(date)}
              accessibilityRole="button"
              style={[styles.day, wide && styles.dayWide, active && styles.dayActive]}
            >
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{WEEKDAY_SHORT[i]}</Text>
              <Text style={[styles.dayNumber, wide && styles.dayNumberWide, active && styles.dayNumberActive]}>
                {date.getDate()}
              </Text>
              <View style={[styles.dot, hasReminder(date) && (active ? styles.dotActive : styles.dotOn)]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, width: '100%' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  titleWide: { fontSize: 16 },
  weekNav: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  weekNavText: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.primary },
  days: { flexDirection: 'row', gap: 5 },
  daysWide: { gap: 12 },
  day: {
    flex: 1,
    height: 72,
    borderRadius: radius.dayCell,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dayWide: { height: 78 },
  dayActive: { backgroundColor: colors.primary },
  dayLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.textSecondary },
  dayLabelActive: { color: colors.todayLabel },
  dayNumber: { fontFamily: fonts.black, fontSize: 20, color: colors.text },
  dayNumberWide: { fontSize: 23 },
  dayNumberActive: { color: colors.white },
  dot: { width: 4, height: 4, borderRadius: radius.pill },
  dotOn: { backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.white },
});
