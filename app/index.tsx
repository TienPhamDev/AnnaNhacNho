import { Text, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../src/theme';
import { strings } from '../src/strings';

// Màn tạm để kiểm tra khung project; sẽ thay bằng màn Lịch nhắc.
export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.appName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.text },
});
