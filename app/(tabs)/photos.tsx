import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PhotoGrid } from '../../src/components/PhotoGrid';
import { addPhoto, deletePhoto, getPhotos } from '../../src/db/photos';
import { savePhotoFile } from '../../src/photoFiles';
import { colors, fonts, layout } from '../../src/theme';
import { photoStrings } from '../../src/strings';
import type { Photo } from '../../src/types';

export default function PhotosScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState<Photo[]>([]);

  // iPad (màn rộng) hiện nhiều cột hơn iPhone
  const columns = width >= layout.wideBreakpoint ? 4 : 2;

  const load = useCallback(() => getPhotos(db).then(setPhotos), [db]);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const pickPhoto = async () => {
    try {
      // Thư viện ảnh iOS không cần xin quyền riêng khi chọn bằng bộ chọn hệ thống
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.9 });
      if (result.canceled) return;
      const fileName = await savePhotoFile(result.assets[0].uri);
      await addPhoto(db, fileName);
      await load();
    } catch {
      Alert.alert(photoStrings.addError);
    }
  };

  const removePhoto = async (photo: Photo) => {
    await deletePhoto(db, photo);
    await load();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
    >
      <Text style={styles.title}>{photoStrings.title}</Text>
      <Text style={styles.subtitle}>{photoStrings.subtitle}</Text>
      <PhotoGrid photos={photos} columns={columns} onAdd={pickPhoto} onDelete={removePhoto} />
      {photos.length === 0 && <Text style={styles.empty}>{photoStrings.empty}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 16, paddingBottom: 48 },
  title: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  empty: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
