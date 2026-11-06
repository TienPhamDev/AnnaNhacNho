import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ImagePlus, X } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { photoStrings } from '../strings';
import type { Photo } from '../types';

const GAP = 12;

type Props = {
  photos: Photo[];
  columns: number;
  onAdd: () => void;
  onDelete: (photo: Photo) => void;
};

// Lưới ảnh: ô đầu tiên là nút thêm ảnh, các ô sau là ảnh đã thêm
export function PhotoGrid({ photos, columns, onAdd, onDelete }: Props) {
  // Mỗi ô rộng (100 / số cột)% trừ phần khoảng cách; giữ tỉ lệ 3:4
  const tile = { width: `${100 / columns}%` as const };

  const confirmDelete = (photo: Photo) =>
    Alert.alert(photoStrings.deleteTitle, photoStrings.deleteMessage, [
      { text: photoStrings.cancel, style: 'cancel' },
      { text: photoStrings.delete, style: 'destructive', onPress: () => onDelete(photo) },
    ]);

  return (
    <View style={styles.grid}>
      <View style={[styles.cell, tile]}>
        <Pressable onPress={onAdd} style={[styles.box, styles.addBox]} accessibilityRole="button">
          <ImagePlus size={32} color={colors.primary} />
          <Text style={styles.addText}>{photoStrings.add}</Text>
        </Pressable>
      </View>
      {photos.map((photo) => (
        <View key={photo.id} style={[styles.cell, tile]}>
          <View style={styles.box}>
            <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />
            <Pressable
              onPress={() => confirmDelete(photo)}
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel={photoStrings.delete}
              hitSlop={8}
            >
              <X size={16} color="#ffffff" strokeWidth={3} />
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Cell có padding GAP/2, grid bù lại bằng margin âm để mép ngoài thẳng hàng
  grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -GAP / 2 },
  cell: { padding: GAP / 2 },
  box: {
    aspectRatio: 3 / 4,
    borderRadius: radius.photoSlot,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
  },
  addBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  addText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primary },
  image: { width: '100%', height: '100%' },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(52, 41, 68, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
