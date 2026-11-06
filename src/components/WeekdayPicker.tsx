import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { editStrings } from '../strings';
import { WEEKDAY_SHORT } from '../dateUtils';
import { summarizeWeekdays } from '../reminderUtils';

type Props = { value: number[]; onChange: (weekdays: number[]) => void };

// "Lặp lại": 7 ô T2..CN, bấm để chọn / bỏ chọn; bên phải tóm tắt ("Thứ 2 – Thứ 6")
export function WeekdayPicker({ value, onChange }: Props) {
  const toggle = (day: number) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b));

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.label}>{editStrings.repeatLabel}</Text>
        <Text style={styles.summary}>{value.length > 0 ? summarizeWeekdays(value) : ''}</Text>
      </View>
      <View style={styles.days}>
        {WEEKDAY_SHORT.map((label, day) => {
          const active = value.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggle(day)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text style={[styles.dayText, active && styles.dayTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  summary: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  days: { flexDirection: 'row', gap: 7 },
  day: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: { backgroundColor: colors.primary },
  dayText: { fontFamily: fonts.black, fontSize: 13, color: colors.textSecondary },
  dayTextActive: { color: colors.white },
});
