import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { editStrings } from '../strings';
import { TimeWheel } from './TimeWheel';

type Props = { hour: number; minute: number; onChange: (hour: number, minute: number) => void };

// Card "Giờ nhắc": hai bộ chọn cuộn (giờ : phút), 24 giờ
export function TimePickerCard({ hour, minute, onChange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{editStrings.timeLabel}</Text>
        <Text style={styles.hint}>{editStrings.time24}</Text>
      </View>
      <View style={styles.wheels}>
        <TimeWheel count={24} value={hour} onChange={(h) => onChange(h, minute)} accessibilityLabel="Giờ" />
        <Text style={styles.colon}>:</Text>
        <TimeWheel count={60} value={minute} onChange={(m) => onChange(hour, m)} accessibilityLabel="Phút" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 18,
    gap: 8,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  wheels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  colon: { fontFamily: fonts.black, fontSize: 36, color: colors.primary },
});
