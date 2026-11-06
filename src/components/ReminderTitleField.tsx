import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { editStrings } from '../strings';
import { SUBJECTS } from '../reminderUtils';
import type { Subject } from '../types';

type Props = {
  title: string;
  subject: Subject;
  onChangeTitle: (title: string) => void;
  // Bấm vào icon để đổi sang môn kế tiếp
  onCycleSubject: () => void;
};

// "Nhắc con làm gì?": icon môn (bấm để đổi) + ô nhập tên lịch nhắc
export function ReminderTitleField({ title, subject, onChangeTitle, onCycleSubject }: Props) {
  const { Icon } = SUBJECTS[subject];

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{editStrings.nameLabel}</Text>
      <View style={styles.input}>
        <Pressable
          onPress={onCycleSubject}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={editStrings.subjectHint}
        >
          <Icon size={21} color={colors.textSecondary} />
        </Pressable>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder={editStrings.namePlaceholder}
          placeholderTextColor={colors.placeholder}
          maxLength={40}
          style={styles.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 7 },
  label: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: radius.button,
    backgroundColor: colors.white,
  },
  text: { flex: 1, fontFamily: fonts.extraBold, fontSize: 16, color: colors.text, padding: 0 },
});
