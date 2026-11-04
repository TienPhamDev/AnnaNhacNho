import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Music2, Timer } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { editStrings, homeStrings } from '../strings';

type Props = { durationMin: number; onPressDuration: () => void };

// "Tùy chọn buổi học": âm thanh (hiện chỉ có âm mặc định) và thời gian học
export function SessionOptions({ durationMin, onPressDuration }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Music2 size={18} color={colors.textSecondary} />
        <Text style={styles.label}>{editStrings.sound}</Text>
        <Text style={styles.value}>{editStrings.soundDefault}</Text>
      </View>
      <View style={styles.divider} />
      <Pressable style={styles.row} onPress={onPressDuration} accessibilityRole="button">
        <Timer size={18} color={colors.textSecondary} />
        <Text style={styles.label}>{editStrings.duration}</Text>
        <Text style={styles.value}>{homeStrings.minutes(durationMin)}</Text>
        <ChevronRight size={15} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.button, paddingHorizontal: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48 },
  label: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  value: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.divider },
});
