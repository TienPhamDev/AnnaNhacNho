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

export const homeStrings = {
  eyebrow: 'NHẮC NHỎ',
  greeting: (name: string) => (name ? `Chào bé ${name}!` : 'Chào bé!'),
  greetingSubtitle: 'Học một chút, vui thật nhiều. Cùng xem lịch hôm nay nhé.',
  thisWeek: 'Tuần này',
  upNext: 'SẮP ĐẾN GIỜ',
  minutesLeft: (text: string) => `CÒN ${text.toUpperCase()}`,
  nothingLeft: 'Hôm nay không còn lịch nhắc nào',
  today: 'HÔM NAY',
  addPhotoLink: 'Thêm ảnh của bạn để nhắc con nhé',
  photoCardTitle: 'Ảnh của bạn',
  photoCardEmpty: 'Chưa có ảnh. Thêm ảnh để con thấy khi chuông reo.',
  photoCardHas: (n: number) => `Đã có ${n} ảnh. Con sẽ thấy ảnh khi chuông reo.`,
  photoCardAdd: 'Thêm ảnh',
  photoCardManage: 'Quản lý ảnh',
  listTitleToday: 'Lịch nhắc hôm nay',
  listTitleDay: (label: string) => `Lịch nhắc ${label}`,
  activeCount: (n: number) => `${n} đang bật`,
  totalCount: (n: number) => `${n} lịch nhắc`,
  statusOn: 'Đang bật',
  statusOff: 'Tạm tắt',
  addReminder: 'Thêm lịch nhắc',
  emptyList: 'Chưa có lịch nhắc nào cho ngày này.',
  everyDay: 'Mỗi ngày',
  noRepeat: 'Không lặp',
  minutes: (n: number) => `${n} phút`,
  cheer: {
    math: 'Một chút Toán,\nthêm một điều hay!',
    vietnamese: 'Một chút chữ nghĩa,\nthêm một ngày vui!',
    reading: 'Một trang sách,\nmột chân trời mới!',
    other: 'Một chút học hỏi,\nthêm một điều hay!',
  },
};

export const sidebarStrings = {
  brand: 'Nhắc nhỏ',
  noteTitle: 'Nhắc bằng\nyêu thương.',
  noteText: 'Một lời nhắc nhỏ,\nmột thói quen tốt mỗi ngày.',
  profileSubtitle: 'Góc học của con',
};
