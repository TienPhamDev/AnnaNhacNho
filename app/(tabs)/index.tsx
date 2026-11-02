import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { HomeHeader } from '../../src/components/HomeHeader';
import { NextReminderCard } from '../../src/components/NextReminderCard';
import { PhotoPromptCard } from '../../src/components/PhotoPromptCard';
import { ReminderRow } from '../../src/components/ReminderRow';
import { WeekStrip } from '../../src/components/WeekStrip';
import { getPhotos } from '../../src/db/photos';
import { getReminders } from '../../src/db/reminders';
import { addDays, isSameDay, weekdayIndex } from '../../src/dateUtils';
import { findNextToday, remindersOnDay } from '../../src/reminderUtils';
import { toggleReminder } from '../../src/reminderService';
import { useSettings } from '../../src/SettingsContext';
import { useIsWide } from '../../src/useIsWide';
import { colors, fonts, radius } from '../../src/theme';
import { homeStrings } from '../../src/strings';
import type { Photo, Reminder } from '../../src/types';

export default function RemindersScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const wide = useIsWide();
  const { settings } = useSettings();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState(() => new Date());
  // "Bây giờ" cập nhật mỗi 30 giây để số phút còn lại luôn đúng
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    setReminders(await getReminders(db));
    setPhotos(await getPhotos(db));
    setNow(new Date());
  }, [db]);

  // Tải lại mỗi khi quay về tab này (vừa thêm ảnh / sửa lịch ở màn khác)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onToggle = async (reminder: Reminder, enabled: boolean) => {
    await toggleReminder(db, reminder.id, enabled);
    await load();
  };

  const isToday = isSameDay(selected, now);
  const dayReminders = useMemo(() => remindersOnDay(reminders, selected), [reminders, selected]);
  const activeCount = dayReminders.filter((r) => r.enabled).length;
  const next = useMemo(() => findNextToday(reminders, now), [reminders, now]);
  const hasReminder = (date: Date) =>
    reminders.some((r) => r.enabled && r.weekdays.includes(weekdayIndex(date)));
  const listTitle = isToday
    ? homeStrings.listTitleToday
    : homeStrings.listTitleDay(`${selected.getDate()}/${selected.getMonth() + 1}`);

  const goToPhotos = () => router.navigate('/photos');
  // TODO: mở màn "Chỉnh lịch nhắc" (modal) khi màn đó được làm
  const addReminder = () => {};

  const addButton = (
    <Pressable
      onPress={addReminder}
      accessibilityRole="button"
      style={[styles.addButton, wide ? styles.addButtonWide : styles.addButtonPhone]}
    >
      <Plus size={20} color={colors.white} />
      <Text style={styles.addButtonText} numberOfLines={1}>
        {homeStrings.addReminder}
      </Text>
    </Pressable>
  );

  const weekStrip = (
    <WeekStrip
      selected={selected}
      hasReminder={hasReminder}
      onSelect={setSelected}
      onShiftWeek={(days) => setSelected((d) => addDays(d, days))}
      onToday={() => setSelected(new Date())}
      wide={wide}
    />
  );

  const list = (
    <View style={styles.list}>
      <View style={styles.listHeader}>
        <View style={styles.listTitleRow}>
          <Text style={[styles.listTitle, wide && styles.listTitleWide]}>{listTitle}</Text>
          <View style={styles.chip}>
            <View style={styles.chipDot} />
            <Text style={styles.chipText}>{homeStrings.activeCount(activeCount)}</Text>
          </View>
        </View>
        {wide && <Text style={styles.total}>{homeStrings.totalCount(dayReminders.length)}</Text>}
      </View>
      {dayReminders.length === 0 && <Text style={styles.empty}>{homeStrings.emptyList}</Text>}
      {dayReminders.map((reminder) => (
        <ReminderRow key={reminder.id} reminder={reminder} wide={wide} onToggle={(on) => onToggle(reminder, on)} />
      ))}
    </View>
  );

  if (wide) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.contentWide, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.headerWide}>
          <HomeHeader childName={settings.childName} wide />
          {addButton}
        </View>
        {weekStrip}
        <View style={styles.cardsRow}>
          <NextReminderCard next={next} hasPhotos={photos.length > 0} wide onAddPhoto={goToPhotos} />
          <PhotoPromptCard photos={photos} onPress={goToPhotos} />
        </View>
        {list}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.contentPhone, { paddingTop: insets.top + 12 }]}
    >
      <HomeHeader childName={settings.childName} wide={false} />
      {weekStrip}
      <NextReminderCard next={next} hasPhotos={photos.length > 0} wide={false} onAddPhoto={goToPhotos} />
      {list}
      {addButton}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  contentPhone: { paddingHorizontal: 24, paddingBottom: 22, gap: 20 },
  contentWide: { paddingHorizontal: 32, gap: 22 },
  headerWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  cardsRow: { flexDirection: 'row', gap: 18, height: 163 },

  list: { gap: 12, width: '100%' },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  listTitle: { fontFamily: fonts.black, fontSize: 21, color: colors.text },
  listTitleWide: { fontSize: 22 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.greenSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipDot: { width: 5, height: 5, borderRadius: radius.pill, backgroundColor: colors.greenText },
  chipText: { fontFamily: fonts.extraBold, fontSize: 11, color: colors.greenText },
  total: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  empty: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textSecondary, paddingVertical: 8 },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingHorizontal: 22,
  },
  addButtonPhone: { height: 54, width: '100%' },
  addButtonWide: { height: 50, minWidth: 184, flexShrink: 0 },
  addButtonText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
});
