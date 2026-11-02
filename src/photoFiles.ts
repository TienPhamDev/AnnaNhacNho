import { Directory, File, Paths } from 'expo-file-system';

// Ảnh được copy vào thư mục riêng của app để không mất khi thư viện ảnh đổi
const photoDir = () => new Directory(Paths.document, 'photos');

export function photoUri(fileName: string): string {
  return new File(photoDir(), fileName).uri;
}

// Copy ảnh đã chọn vào thư mục app; trả về tên file mới
export async function savePhotoFile(sourceUri: string): Promise<string> {
  const dir = photoDir();
  dir.create({ idempotent: true, intermediates: true });
  const ext = sourceUri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}.${ext}`;
  await new File(sourceUri).copy(new File(dir, fileName));
  return fileName;
}

export function deletePhotoFile(fileName: string) {
  const file = new File(photoDir(), fileName);
  if (file.exists) file.delete();
}
