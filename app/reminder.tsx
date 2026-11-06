import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarHeart, Check } from 'lucide-react-native';
import { MessageField } from '../src/components/MessageField';
import { OptionPickerModal } from '../src/components/OptionPickerModal';
import { PhotoChooser } from '../src/components/PhotoChooser';
import { ReminderTitleField } from '../src/components/ReminderTitleField';
import { SessionOptions } from '../src/components/SessionOptions';
import { TimePickerCard } from '../src/components/TimePickerCard';
import { WeekdayPicker } from '../src/components/WeekdayPicker';
import { getPhotos } from '../src/db/photos';
import { getReminder } from '../src/db/reminders';
import { pickAndAddPhoto } from '../src/pickPhoto';
import { createReminder, editReminder, removeReminder } from '../src/reminderService';
import { SUBJECT_ORDER, detectSubject } from '../src/reminderUtils';
import { useSettings } from '../src/SettingsContext';
import { colors, fonts, radius } from '../src/theme';
import { editStrings, homeStrings } from '../src/strings';
import type { Photo, ReminderInput, Subject } from '../src/types';

const DURATIONS = [10, 15, 20, 25, 30, 45, 60];

// Mặc định cho lịch nhắc mới: Thứ 2 – Thứ 6, 17:30, 30 phút
const NEW_DEFAULTS = { hour: 17, minute: 30, weekdays: [0, 1, 2, 3, 4], durationMin: 30 };

// Màn "Chỉnh lịch nhắc" (modal). Có ?id thì sửa, không có thì thêm mới.
export default function ReminderEditScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const params = useLocalSearchParams<{ id?: string }>();
  const editingId = params.id ? Number(params.id) : null;

  const [loaded, setLoaded] = useState(editingId === null);
  const [enabled, setEnabled] = useState(true);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('other');
  // Phụ huynh bấm đổi môn bằng tay thì không tự đoán từ tên nữa
  const [subjectLocked, setSubjectLocked] = useState(false);
  const [hour, setHour] = useState(NEW_DEFAULTS.hour);
  const [minute, setMinute] = useState(NEW_DEFAULTS.minute);
  const [weekdays, setWeekdays] = useState<number[]>(NEW_DEFAULTS.weekdays);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [message, setMessage] = useState(editStrings.messageDefault(settings.childName.trim()));
  const [durationMin, setDurationMin] = useState(NEW_DEFAULTS.durationMin);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Nạp danh sách ảnh và (khi sửa) dữ liệu lịch nhắc
  useEffect(() => {
    (async () => {
      const library = await getPhotos(db);
      setPhotos(library);
      if (editingId !== null) {
        const r = await getReminder(db, editingId);
        if (r) {
          setEnabled(r.enabled);
          setTitle(r.title);
          setSubject(r.subject);
          setSubjectLocked(true);
          setHour(r.hour);
          setMinute(r.minute);
          setWeekdays(r.weekdays);
          // Ảnh đã bị xóa khỏi thư viện thì coi như chưa có ảnh
          setPhotoUri(library.some((p) => p.uri === r.photoUri) ? r.photoUri : null);
          setMessage(r.message);
          setDurationMin(r.durationMin);
        }
        setLoaded(true);
      }
    })();
  }, [db, editingId]);

  const onChangeTitle = (value: string) => {
    setTitle(value);
    if (!subjectLocked) setSubject(detectSubject(value));
  };

  const cycleSubject = () => {
    setSubject((s) => SUBJECT_ORDER[(SUBJECT_ORDER.indexOf(s) + 1) % SUBJECT_ORDER.length]);
    setSubjectLocked(true);
  };

  const pickNewPhoto = async () => {
    try {
      if (!(await pickAndAddPhoto(db))) return;
      const library = await getPhotos(db);
      setPhotos(library);
      setPhotoUri(library[0]?.uri ?? null); // ảnh vừa thêm nằm đầu danh sách
    } catch {
      Alert.alert(editStrings.errorSave);
    }
  };

  const save = async () => {
    if (!title.trim()) return setError(editStrings.errorName);
    if (weekdays.length === 0) return setError(editStrings.errorDays);
    setError('');
    setSaving(true);
    const input: ReminderInput = {
      title: title.trim(),
      subject,
      hour,
      minute,
      weekdays,
      message: message.trim(),
      photoUri,
      sound: settings.defaultSound,
      durationMin,
      enabled,
    };
    try {
      if (editingId !== null) await editReminder(db, editingId, input);
      else await createReminder(db, input);
      router.back();
    } catch {
      setSaving(false);
      setError(editStrings.errorSave);
    }
  };

  const confirmDelete = () =>
    Alert.alert(editStrings.deleteTitle, editStrings.deleteMessage, [
      { text: editStrings.cancel, style: 'cancel' },
      {
        text: editStrings.delete,
        style: 'destructive',
        onPress: async () => {
          if (editingId === null) return;
          await removeReminder(db, editingId);
          router.back();
        },
      },
    ]);

  if (!loaded) return <View style={styles.screen} />;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button">
          <Text style={styles.cancel}>{editStrings.cancel}</Text>
        </Pressable>
        <Text style={styles.title}>{editingId !== null ? editStrings.titleEdit : editStrings.titleNew}</Text>
        <View style={styles.headerIcon}>
          <CalendarHeart size={23} color={colors.textSecondary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <ReminderTitleField title={title} subject={subject} onChangeTitle={onChangeTitle} onCycleSubject={cycleSubject} />
        <TimePickerCard
          hour={hour}
          minute={minute}
          onChange={(h, m) => {
            setHour(h);
            setMinute(m);
          }}
        />
        <WeekdayPicker value={weekdays} onChange={setWeekdays} />
        <PhotoChooser photos={photos} selectedUri={photoUri} onSelect={setPhotoUri} onPickNew={pickNewPhoto} />
        <MessageField value={message} onChange={setMessage} />
        <SessionOptions durationMin={durationMin} onPressDuration={() => setPickerOpen(true)} />

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={save} disabled={saving} style={styles.saveButton} accessibilityRole="button">
          <Check size={20} color={colors.white} />
          <Text style={styles.saveText}>{editStrings.save}</Text>
        </Pressable>
        {editingId !== null && (
          <Pressable onPress={confirmDelete} style={styles.deleteButton} accessibilityRole="button">
            <Text style={styles.deleteText}>{editStrings.delete}</Text>
          </Pressable>
        )}
      </ScrollView>

      <OptionPickerModal
        visible={pickerOpen}
        title={editStrings.durationPickerTitle}
        options={DURATIONS.map((d) => ({ label: homeStrings.minutes(d), value: d }))}
        selected={durationMin}
        onSelect={setDurationMin}
        onClose={() => setPickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  cancel: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.primary },
  title: { fontFamily: fonts.black, fontSize: 22, color: colors.text },
  headerIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  // Giới hạn bề rộng để form không quá dài trên iPad
  content: { paddingHorizontal: 24, paddingTop: 8, gap: 19, width: '100%', maxWidth: 560, alignSelf: 'center' },
  error: { fontFamily: fonts.bold, fontSize: 13, color: colors.danger },
  saveButton: {
    height: 54,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  saveText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  deleteButton: { height: 44, alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontFamily: fonts.bold, fontSize: 14, color: colors.danger },
});
