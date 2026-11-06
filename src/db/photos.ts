import type { SQLiteDatabase } from 'expo-sqlite';
import type { Photo } from '../types';
import { deletePhotoFile, photoUri } from '../photoFiles';

type Row = { id: number; file_name: string; created_at: number };

const toPhoto = (r: Row): Photo => ({ id: r.id, uri: photoUri(r.file_name), createdAt: r.created_at });

// Ảnh mới nhất lên đầu
export async function getPhotos(db: SQLiteDatabase): Promise<Photo[]> {
  const rows = await db.getAllAsync<Row>('SELECT * FROM photos ORDER BY created_at DESC, id DESC');
  return rows.map(toPhoto);
}

export async function addPhoto(db: SQLiteDatabase, fileName: string) {
  await db.runAsync('INSERT INTO photos (file_name, created_at) VALUES (?, ?)', fileName, Date.now());
}

// Xóa ảnh: gỡ khỏi các lịch nhắc đang dùng, xóa dòng, rồi xóa file
export async function deletePhoto(db: SQLiteDatabase, photo: Photo) {
  const row = await db.getFirstAsync<Row>('SELECT * FROM photos WHERE id = ?', photo.id);
  if (!row) return;
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE reminders SET photo_uri = NULL WHERE photo_uri = ?', photo.uri);
    await db.runAsync('DELETE FROM photos WHERE id = ?', photo.id);
  });
  deletePhotoFile(row.file_name);
}
