// Design tokens lấy từ Figma. Không viết màu rải rác trong component.
export const colors = {
  background: '#fcf9f4',
  text: '#342944',
  textSecondary: '#80758d',
  placeholder: '#8e7aa7',
  primary: '#7653c7',
  primarySoft: '#efe8fc',
  border: '#ddd0f4',
  yellowSoft: '#fff0bf',
  orangeSoft: '#ffe5d4',
  greenSoft: '#e5f1e7',
  greenText: '#577c60',
  // Nền màn "Đến giờ học" (gradient dọc)
  alarmGradient: ['#e3d8f1', '#f4ecf1', '#d5c5eb'],
} as const;

export const radius = {
  card: 24,
  button: 18,
  subjectIcon: 16,
  dayCell: 18,
  photoSlot: 28,
  pill: 100,
} as const;

// Tên font Nunito đã đăng ký trong app/_layout.tsx
export const fonts = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

// Lịch nhắc đang tắt
export const disabledOpacity = 0.65;

// Điều hướng
export const layout = {
  sidebarWidth: 222,
  // Từ chiều rộng này trở lên dùng thanh bên (iPad); nhỏ hơn dùng tab bar dưới (iPhone)
  wideBreakpoint: 700,
} as const;
