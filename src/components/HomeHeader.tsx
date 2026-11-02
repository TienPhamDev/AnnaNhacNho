import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { homeStrings } from '../strings';

type Props = { childName: string; wide: boolean };

// Lời chào. iPhone: kèm avatar chữ cái đầu. iPad: kèm lời phụ (nút thêm nằm ở màn hình).
export function HomeHeader({ childName, wide }: Props) {
  const initial = (childName.trim().charAt(0) || 'B').toUpperCase();

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        {!wide && <Text style={styles.eyebrow}>{homeStrings.eyebrow}</Text>}
        <Text style={[styles.greeting, wide && styles.greetingWide]}>{homeStrings.greeting(childName.trim())}</Text>
        {wide && <Text style={styles.subtitle}>{homeStrings.greetingSubtitle}</Text>}
      </View>
      {!wide && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  texts: { gap: 2, flexShrink: 1 },
  eyebrow: { fontFamily: fonts.black, fontSize: 13, color: colors.primary },
  greeting: { fontFamily: fonts.black, fontSize: 28, color: colors.text },
  greetingWide: { fontSize: 32 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.button,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.black, fontSize: 24, color: colors.text },
});
