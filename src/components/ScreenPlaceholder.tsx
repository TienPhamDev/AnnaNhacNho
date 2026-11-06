import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

// Màn tạm cho từng tab; sẽ thay bằng màn thật theo Figma.
export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.text },
});
