import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BellRing } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { alarmStrings } from '../strings';

// Nút xem thử màn "Đến giờ học" mà không cần chờ đến giờ nhắc
export function AlarmPreviewButton() {
  const router = useRouter();

  return (
    <View style={styles.field}>
      <Pressable onPress={() => router.push('/alarm')} style={styles.button} accessibilityRole="button">
        <BellRing size={18} color={colors.primary} />
        <Text style={styles.text}>{alarmStrings.previewButton}</Text>
      </Pressable>
      <Text style={styles.hint}>{alarmStrings.previewHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 52,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.primary },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
});
