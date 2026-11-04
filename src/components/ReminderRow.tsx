import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, disabledOpacity, fonts, radius } from '../theme';
import { homeStrings } from '../strings';
import { SUBJECTS, summarizeWeekdays } from '../reminderUtils';
import { formatTime } from '../dateUtils';
import { ToggleSwitch } from './ToggleSwitch';
import type { Reminder } from '../types';

type Props = { reminder: Reminder; wide: boolean; onPress: () => void; onToggle: (enabled: boolean) => void };

// Một dòng lịch nhắc: icon môn, giờ lớn, tên, lịch lặp · thời lượng, công tắc
export function ReminderRow({ reminder, wide, onPress, onToggle }: Props) {
  const { Icon, background } = SUBJECTS[reminder.subject];
  const time = formatTime(reminder.hour, reminder.minute);
  const summary = `${summarizeWeekdays(reminder.weekdays)} · ${homeStrings.minutes(reminder.durationMin)}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.row, wide && styles.rowWide, !reminder.enabled && styles.rowOff]}
    >
      <View style={[styles.icon, wide && styles.iconWide, { backgroundColor: background }]}>
        <Icon size={23} color={colors.textSecondary} />
      </View>
      {/* iPad: giờ nằm riêng bên trái; iPhone: giờ lớn nằm trên cùng cột chữ */}
      {wide && <Text style={[styles.time, styles.timeWide]}>{time}</Text>}
      <View style={styles.texts}>
        {!wide && <Text style={[styles.time, styles.timePhone]}>{time}</Text>}
        <Text style={[styles.title, wide && styles.titleWide]} numberOfLines={1}>
          {reminder.title}
        </Text>
        <Text style={[styles.summary, wide && styles.summaryWide]} numberOfLines={1}>
          {summary}
        </Text>
      </View>
      {wide && (
        <Text style={[styles.status, reminder.enabled && styles.statusOn]}>
          {reminder.enabled ? homeStrings.statusOn : homeStrings.statusOff}
        </Text>
      )}
      <ToggleSwitch value={reminder.enabled} onValueChange={onToggle} accessibilityLabel={reminder.title} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.white,
  },
  rowWide: { gap: 20, padding: 20 },
  rowOff: { opacity: disabledOpacity },
  icon: {
    width: 44,
    height: 50,
    borderRadius: radius.subjectIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWide: { width: 52, height: 52 },
  time: { fontFamily: fonts.black, color: colors.text },
  timePhone: { fontSize: 27, lineHeight: 30 },
  timeWide: { fontSize: 29, width: 92 },
  texts: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.text },
  titleWide: { fontSize: 17 },
  summary: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
  summaryWide: { fontSize: 13 },
  status: { fontFamily: fonts.bold, fontSize: 13, color: colors.textSecondary, width: 90 },
  statusOn: { color: colors.primary },
});
