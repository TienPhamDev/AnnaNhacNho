import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { editStrings } from '../strings';

export const MESSAGE_MAX = 80;

type Props = { value: string; onChange: (value: string) => void };

// "Lời nhắn yêu thương" có đếm ký tự (tối đa 80)
export function MessageField({ value, onChange }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{editStrings.messageLabel}</Text>
      <View style={styles.box}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={editStrings.messagePlaceholder}
          placeholderTextColor={colors.placeholder}
          maxLength={MESSAGE_MAX}
          multiline
          style={styles.text}
        />
        <Text style={styles.counter}>{`${value.length} / ${MESSAGE_MAX}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 7 },
  label: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  box: { backgroundColor: colors.white, borderRadius: radius.button, padding: 15, gap: 8 },
  text: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.text, padding: 0, minHeight: 44 },
  counter: { fontFamily: fonts.regular, fontSize: 11, color: colors.counter, textAlign: 'right' },
});
