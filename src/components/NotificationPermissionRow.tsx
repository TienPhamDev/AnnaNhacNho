import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors, fonts, radius } from '../theme';
import { notificationStrings } from '../strings';
import { hasNotificationPermission, openSystemSettings, requestNotificationPermission } from '../notifications';

// Trạng thái quyền thông báo + nút bật. Bị từ chối rồi thì dẫn sang Cài đặt của máy.
export function NotificationPermissionRow() {
  const [granted, setGranted] = useState<boolean | null>(null);

  // Kiểm tra lại mỗi khi quay lại màn (người dùng có thể vừa đổi trong Cài đặt máy)
  useFocusEffect(
    useCallback(() => {
      hasNotificationPermission().then(setGranted);
    }, []),
  );

  const enable = async () => {
    const ok = await requestNotificationPermission();
    setGranted(ok);
    // Không xin lại được (đã từ chối) thì mở Cài đặt của máy
    if (!ok) openSystemSettings();
  };

  if (granted === null) return null;

  return (
    <View style={styles.field}>
      <View style={styles.row}>
        <Text style={styles.label}>{notificationStrings.statusLabel}</Text>
        <View style={[styles.chip, granted ? styles.chipOn : styles.chipOff]}>
          <Text style={[styles.chipText, granted ? styles.chipTextOn : styles.chipTextOff]}>
            {granted ? notificationStrings.granted : notificationStrings.denied}
          </Text>
        </View>
      </View>
      {!granted && (
        <>
          <Text style={styles.hint}>{notificationStrings.hint}</Text>
          <Pressable onPress={enable} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>{notificationStrings.enable}</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  chip: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  chipOn: { backgroundColor: colors.greenSoft },
  chipOff: { backgroundColor: colors.yellowSoft },
  chipText: { fontFamily: fonts.bold, fontSize: 13 },
  chipTextOn: { color: colors.greenText },
  chipTextOff: { color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { fontFamily: fonts.bold, fontSize: 16, color: '#ffffff' },
});
