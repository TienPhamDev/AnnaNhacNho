// Toàn bộ chữ hiển thị (tiếng Việt) gom về một chỗ để dễ sửa.
export const strings = {
  appName: 'Nhắc Anna học',
  tabs: {
    reminders: 'Lịch nhắc',
    photos: 'Ảnh của bạn',
    settings: 'Cài đặt',
  },
};

export const navStrings = {
  // Tên hiển thị tạm ở thanh bên cho đến khi có dữ liệu Cài đặt
  childFallback: 'Bé',
};

export const settingsStrings = {
  childNameLabel: 'Tên của con',
  childNamePlaceholder: 'Nhập tên con',
  childNameHint: 'Tên này hiện trong lời chào và thanh bên.',
};

export const photoStrings = {
  title: 'Ảnh của bạn',
  subtitle: 'Ảnh hiện toàn màn hình khi đến giờ học để nhắc con.',
  add: 'Thêm ảnh',
  empty: 'Chưa có ảnh nào. Thêm ảnh của bạn để nhắc con nhé!',
  deleteTitle: 'Xóa ảnh này?',
  deleteMessage: 'Các lịch nhắc đang dùng ảnh này sẽ chuyển sang không có ảnh.',
  delete: 'Xóa',
  cancel: 'Hủy',
  addError: 'Không thêm được ảnh. Bạn thử lại nhé.',
};

export const notificationStrings = {
  title: 'Đến giờ học rồi!',
  statusLabel: 'Thông báo',
  granted: 'Đã bật',
  denied: 'Chưa bật',
  hint: 'Cần bật thông báo để app nhắc con đúng giờ.',
  enable: 'Bật thông báo',
  openSettings: 'Mở Cài đặt của máy',
};
