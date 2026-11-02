import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, ImagePlus } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { homeStrings } from '../strings';
import type { Photo } from '../types';

type Props = { photos: Photo[]; onPress: () => void };

// Card "Ảnh của bạn" (chỉ iPad): mời thêm ảnh, hoặc hiện ảnh mới nhất nếu đã có
export function PhotoPromptCard({ photos, onPress }: Props) {
  const has = photos.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.slot}>
        {has ? (
          <Image source={{ uri: photos[0].uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <ImagePlus size={30} color={colors.primary} />
        )}
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{homeStrings.photoCardTitle}</Text>
        <Text style={styles.text}>{has ? homeStrings.photoCardHas(photos.length) : homeStrings.photoCardEmpty}</Text>
        <Pressable onPress={onPress} style={styles.link} accessibilityRole="button">
          <Text style={styles.linkText}>{has ? homeStrings.photoCardManage : homeStrings.photoCardAdd}</Text>
          <ArrowRight size={15} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 310,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    width: 82,
    height: 116,
    borderRadius: 17,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  texts: { flex: 1, gap: 7 },
  title: { fontFamily: fonts.black, fontSize: 17, color: colors.text },
  text: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  link: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  linkText: { fontFamily: fonts.black, fontSize: 13, color: colors.primary },
});
