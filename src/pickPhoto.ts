import type { SQLiteDatabase } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { addPhoto } from './db/photos';
import { savePhotoFile } from './photoFiles';

// Mở bộ chọn ảnh, copy ảnh vào thư mục app và thêm vào "Ảnh của bạn".
// Trả về true nếu có ảnh mới (false khi người dùng hủy).
export async function pickAndAddPhoto(db: SQLiteDatabase): Promise<boolean> {
  // Thư viện ảnh iOS không cần xin quyền riêng khi chọn bằng bộ chọn hệ thống
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.9 });
  if (result.canceled) return false;
  const fileName = await savePhotoFile(result.assets[0].uri);
  await addPhoto(db, fileName);
  return true;
}
