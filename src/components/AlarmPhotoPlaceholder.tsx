import { StyleSheet, Text, View } from 'react-native';
import { ImagePlus } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { alarmStrings } from '../strings';

// Hiện giữa màn khi lịch nhắc chưa có ảnh: mời phụ huynh thêm ảnh
export function AlarmPhotoPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <ImagePlus size={36} color={colors.placeholder} />
      </View>
      <Text style={styles.title}>{alarmStrings.photoPlaceholderTitle}</Text>
      <Text style={styles.text}>{alarmStrings.photoPlaceholderText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16, width: '100%', maxWidth: 520 },
  tile: {
    width: 86,
    height: 86,
    borderRadius: radius.photoSlot,
    backgroundColor: 'rgba(247, 242, 252, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.placeholder, textAlign: 'center' },
  text: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.placeholder, textAlign: 'center' },
});
