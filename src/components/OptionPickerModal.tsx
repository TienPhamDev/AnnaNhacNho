import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';

type Option = { label: string; value: number };
type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selected: number;
  onSelect: (value: number) => void;
  onClose: () => void;
};

// Hộp chọn một giá trị trong danh sách ngắn (ví dụ thời gian học)
export function OptionPickerModal({ visible, title, options, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              accessibilityRole="button"
            >
              <Text style={[styles.optionText, option.value === selected && styles.optionActive]}>{option.label}</Text>
              {option.value === selected && <Check size={18} color={colors.primary} />}
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(52, 41, 68, 0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  sheet: { width: '100%', maxWidth: 360, backgroundColor: colors.white, borderRadius: radius.card, padding: 16, gap: 4 },
  title: { fontFamily: fonts.black, fontSize: 18, color: colors.text, paddingHorizontal: 8, paddingBottom: 8 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, height: 46 },
  optionText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  optionActive: { color: colors.primary, fontFamily: fonts.black },
});
