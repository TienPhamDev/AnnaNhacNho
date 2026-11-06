import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { settingsStrings } from '../strings';
import { useSettings } from '../SettingsContext';

// Ô nhập tên con; lưu vào SQLite khi rời ô hoặc bấm xong trên bàn phím
export function ChildNameField() {
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(settings.childName);

  // Đồng bộ khi dữ liệu từ SQLite tải xong
  useEffect(() => setName(settings.childName), [settings.childName]);

  const save = () => {
    const trimmed = name.trim();
    setName(trimmed);
    if (trimmed !== settings.childName) updateSettings({ childName: trimmed });
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{settingsStrings.childNameLabel}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        onBlur={save}
        onSubmitEditing={save}
        placeholder={settingsStrings.childNamePlaceholder}
        placeholderTextColor={colors.placeholder}
        maxLength={30}
        returnKeyType="done"
        style={styles.input}
      />
      <Text style={styles.hint}>{settingsStrings.childNameHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.text,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
});
