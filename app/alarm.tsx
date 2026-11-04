import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlarmClockPlus, BellRing, Check } from 'lucide-react-native';
import { AlarmBackground } from '../src/components/AlarmBackground';
import { AlarmPhotoPlaceholder } from '../src/components/AlarmPhotoPlaceholder';
import { formatLongDate, formatTime } from '../src/dateUtils';
import { getPhotos } from '../src/db/photos';
import { getReminder } from '../src/db/reminders';
import { markStudied } from '../src/db/studyLogs';
import { cancelSnoozes, scheduleSnooze } from '../src/notifications';
import { useSettings } from '../src/SettingsContext';
import { useIsWide } from '../src/useIsWide';
import { colors, fonts, radius } from '../src/theme';
import { alarmStrings, editStrings, homeStrings } from '../src/strings';
import type { Reminder } from '../src/types';

// Phần dữ liệu màn hình cần hiển thị
type View_ = { reminder: Reminder | null; title: string; message: string; durationMin: number; photoUri: string | null };

// Màn "Đến giờ học" (toàn màn hình). Có ?id thì theo lịch nhắc đó; không có id là bản xem thử.
export default function AlarmScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const wide = useIsWide();
  const { settings } = useSettings();
  const params = useLocalSearchParams<{ id?: string }>();
  const reminderId = params.id ? Number(params.id) : null;

  const [data, setData] = useState<View_ | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const name = settings.childName.trim();
      if (reminderId === null) {
        // Xem thử: dữ liệu mẫu, ảnh mới nhất trong "Ảnh của bạn" (nếu có)
        const photos = await getPhotos(db);
        return setData({
          reminder: null,
          title: alarmStrings.previewSubject,
          message: editStrings.messageDefault(name),
          durationMin: 30,
          photoUri: photos[0]?.uri ?? null,
        });
      }
      const reminder = await getReminder(db, reminderId);
      // Lịch nhắc đã bị xóa (ví dụ bấm vào thông báo cũ): về màn chính
      if (!reminder) return router.replace('/');
      const photos = await getPhotos(db);
      setData({
        reminder,
        title: reminder.title,
        message: reminder.message.trim() || editStrings.messageDefault(name),
        durationMin: reminder.durationMin,
        // Ảnh đã bị xóa khỏi thư viện thì coi như chưa có ảnh
        photoUri: photos.some((p) => p.uri === reminder.photoUri) ? reminder.photoUri : null,
      });
    })();
  }, [db, reminderId, settings.childName, router]);

  const leave = () => router.replace('/');

  // "Con học ngay!": ghi đã học, hủy các lần nhắc lại đang chờ
  const studyNow = async () => {
    if (data?.reminder) {
      await markStudied(db, data.reminder.id);
      await cancelSnoozes(data.reminder.id);
    }
    leave();
  };

  // "Nhắc lại sau N phút"
  const snooze = async () => {
    if (data?.reminder) {
      await cancelSnoozes(data.reminder.id);
      await scheduleSnooze(data.reminder, settings.snoozeMinutes);
    }
    leave();
  };

  if (!data) return <View style={styles.screen} />;

  const bottomPad = Math.max(insets.bottom, 26) + 10;

  return (
    <View style={styles.screen}>
      <AlarmBackground photoUri={data.photoUri} />

      <View style={[styles.top, { paddingTop: insets.top + (wide ? 37 : 36) }]}>
        <View style={[styles.badge, wide && styles.badgeWide]}>
          <BellRing size={wide ? 17 : 16} color={colors.primary} />
          <Text style={[styles.badgeText, wide && styles.badgeTextWide]}>{alarmStrings.badge}</Text>
        </View>
        <Text style={[styles.time, wide && styles.timeWide]}>{formatTime(now.getHours(), now.getMinutes())}</Text>
        <Text style={[styles.date, wide && styles.dateWide]}>{formatLongDate(now)}</Text>
      </View>

      {/* Chưa có ảnh thì mời thêm ảnh; có ảnh thì ảnh đã phủ toàn màn hình ở nền */}
      <View style={styles.middle}>{!data.photoUri && <AlarmPhotoPlaceholder />}</View>

      <View style={[styles.bottom, { paddingBottom: bottomPad }]}>
        <View style={[styles.content, wide && styles.contentWide]}>
          <View style={styles.messageBlock}>
            <Text style={[styles.message, wide && styles.messageWide]}>{data.message}</Text>
            <Text style={[styles.sub, wide && styles.subWide]}>
              {`${data.title} · ${homeStrings.minutes(data.durationMin)}`}
            </Text>
          </View>
          <View style={[styles.actions, wide && styles.actionsWide]}>
            <Pressable
              onPress={studyNow}
              accessibilityRole="button"
              style={[styles.primaryButton, wide && styles.primaryButtonWide]}
            >
              <Check size={20} color={colors.white} />
              <Text style={styles.primaryText}>{alarmStrings.studyNow}</Text>
            </Pressable>
            <Pressable
              onPress={snooze}
              accessibilityRole="button"
              style={[styles.secondaryButton, wide && styles.secondaryButtonWide]}
            >
              <AlarmClockPlus size={20} color={colors.primary} />
              <Text style={styles.secondaryText}>{alarmStrings.snooze(settings.snoozeMinutes)}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#e7dff2' },
  top: { alignItems: 'center', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  badgeWide: { gap: 8, paddingHorizontal: 15, paddingVertical: 8 },
  badgeText: { fontFamily: fonts.black, fontSize: 12, color: colors.primary },
  badgeTextWide: { fontSize: 13 },
  time: { fontFamily: fonts.black, fontSize: 76, lineHeight: 84, color: colors.text },
  timeWide: { fontSize: 82, lineHeight: 90 },
  date: { fontFamily: fonts.bold, fontSize: 14, color: colors.textSecondary },
  dateWide: { fontSize: 16 },

  middle: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48 },

  bottom: { alignItems: 'center', paddingHorizontal: 24 },
  content: { width: '100%', gap: 20, alignItems: 'center' },
  contentWide: { maxWidth: 900, gap: 28 },
  messageBlock: { alignItems: 'center', gap: 8, width: '100%' },
  message: { fontFamily: fonts.black, fontSize: 29, lineHeight: 35, color: colors.text, textAlign: 'center' },
  messageWide: { fontSize: 38, lineHeight: 46 },
  sub: { fontFamily: fonts.bold, fontSize: 14, color: colors.textSecondary },
  subWide: { fontSize: 16 },

  actions: { width: '100%', gap: 10 },
  actionsWide: { width: undefined, flexDirection: 'row', gap: 14, justifyContent: 'center' },
  primaryButton: {
    height: 58,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 22,
  },
  primaryButtonWide: { width: 294 },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  secondaryButton: {
    height: 52,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 22,
  },
  secondaryButtonWide: { width: 270, height: 58 },
  secondaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.primary },
});
