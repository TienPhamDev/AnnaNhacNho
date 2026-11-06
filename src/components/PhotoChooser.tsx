import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, ImagePlus } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { editStrings } from '../strings';
import type { Photo } from '../types';

type Props = {
  photos: Photo[];
  selectedUri: string | null;
  onSelect: (uri: string | null) => void;
  // Mở bộ chọn ảnh để thêm ảnh mới
  onPickNew: () => void;
};

// "Ảnh hiện khi nhắc": card thêm / thay ảnh + dải ảnh có sẵn để chọn nhanh
export function PhotoChooser({ photos, selectedUri, onSelect, onPickNew }: Props) {
  const selected = photos.find((p) => p.uri === selectedUri) ?? null;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{editStrings.photoLabel}</Text>
      <Pressable onPress={onPickNew} style={styles.card} accessibilityRole="button">
        <View style={styles.slot}>
          {selected ? (
            <Image source={{ uri: selected.uri }} style={styles.slotImage} resizeMode="cover" />
          ) : (
            <ImagePlus size={29} color={colors.primary} />
          )}
        </View>
        <View style={styles.texts}>
          <Text style={styles.action}>{editStrings.photoAction}</Text>
          <Text style={styles.desc}>{selected ? editStrings.photoChosen : editStrings.photoEmpty}</Text>
        </View>
        <ChevronRight size={17} color={colors.textSecondary} />
      </Pressable>

      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
          <Pressable
            onPress={() => onSelect(null)}
            style={[styles.thumb, styles.noneThumb, !selected && styles.thumbActive]}
            accessibilityRole="button"
          >
            <Text style={styles.noneText}>{editStrings.photoNone}</Text>
          </Pressable>
          {photos.map((photo) => (
            <Pressable
              key={photo.id}
              onPress={() => onSelect(photo.uri)}
              style={[styles.thumb, photo.uri === selectedUri && styles.thumbActive]}
              accessibilityRole="button"
            >
              <Image source={{ uri: photo.uri }} style={styles.thumbImage} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  label: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.text },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
  },
  slot: {
    width: 76,
    height: 88,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slotImage: { width: '100%', height: '100%' },
  texts: { flex: 1, gap: 5 },
  action: { fontFamily: fonts.black, fontSize: 15, color: colors.primary },
  desc: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  strip: { gap: 8 },
  thumb: {
    width: 56,
    height: 72,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: { borderColor: colors.primary },
  thumbImage: { width: '100%', height: '100%' },
  noneThumb: { backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 4 },
  noneText: { fontFamily: fonts.bold, fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
});
