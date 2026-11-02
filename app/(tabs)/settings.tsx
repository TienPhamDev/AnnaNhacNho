import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationPermissionRow } from '../../src/components/NotificationPermissionRow';
import { ChildNameField } from '../../src/components/ChildNameField';
import { colors, fonts } from '../../src/theme';
import { strings } from '../../src/strings';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{strings.tabs.settings}</Text>
      <ChildNameField />
      <NotificationPermissionRow />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  // Giới hạn bề rộng để ô nhập không quá dài trên iPad
  content: { padding: 24, gap: 24, maxWidth: 560, width: '100%' },
  title: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.text },
});
