# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Nhắc Anna học (Reminder App)

## Mục tiêu
App nhắc con gái học bài, chạy trên iPhone và iPad, làm bằng Expo. Phụ huynh tạo lịch nhắc (môn học, giờ, ngày lặp, lời nhắn, ảnh của phụ huynh). Đến giờ, app báo và hiện màn hình "Đến giờ học" với ảnh toàn màn hình của phụ huynh.

## Thiết kế (nguồn sự thật)
- Figma: https://www.figma.com/design/Ss4iUXNf1yzZ0cu5qNxvpw/app-nhac-anna-hoc (fileKey `Ss4iUXNf1yzZ0cu5qNxvpw`, Page 1)
- Trước khi làm một màn hình, gọi Figma MCP (`get_design_context`) với node id bên dưới, rồi chuyển code React/Tailwind trả về sang React Native `StyleSheet`. KHÔNG cài Tailwind/NativeWind.
- Tải icon/ảnh từ Figma về `assets/` (URL của Figma hết hạn sau 7 ngày, không dùng làm nguồn ảnh khi chạy).
- Tên "bé Mây" trong Figma chỉ là dữ liệu mẫu. Tên con lấy từ Cài đặt, không hardcode.

| Màn hình | Node id | Kích thước |
|---|---|---|
| iPhone · Lịch nhắc học | `3:2165` | 402×970 |
| iPhone · Chỉnh lịch nhắc | `3:2273` | 402×1040 |
| iPhone · Đến giờ học | `3:2358` | 402×900 |
| iPad · Lịch nhắc học | `3:2394` | 1194×834 |
| iPad · Đến giờ học | `3:2536` | 1194×834 |

## Design tokens (đặt trong `src/theme.ts`, không viết màu rải rác trong component)
- Font: **Nunito** (Regular, SemiBold, Bold, ExtraBold, Black), dùng `expo-font` + `@expo-google-fonts/nunito`
- Màu nền app `#fcf9f4`; chữ chính `#342944`; chữ phụ `#80758d`; chữ placeholder `#8e7aa7`
- Màu chủ đạo (nút chính, tab đang chọn, ngày đang chọn) `#7653c7`; tím nhạt (card "sắp đến giờ", icon môn) `#efe8fc`; viền nút phụ `#ddd0f4`
- Vàng nhạt (avatar, icon đồng hồ) `#fff0bf`; cam nhạt (icon Toán) `#ffe5d4`; xanh nhạt (chip "đang bật", icon đọc sách) `#e5f1e7`, chữ xanh `#577c60`
- Nền màn "Đến giờ học": gradient dọc `#e3d8f1` → `#f4ecf1` → `#d5c5eb`; phía dưới có lớp mờ dần từ trong suốt sang `#fcf9f4` để chữ luôn dễ đọc dù ảnh sáng hay tối
- Bo góc: card 24, nút 18, icon môn 16, ô ngày 18, ô thêm ảnh 28, chip/pill 100
- Lịch nhắc đang tắt: `opacity 0.65`, công tắc xám
- Icon: bộ **lucide** (bell-ring, calendar-heart, image, settings-2, alarm-clock, alarm-clock-plus, image-plus, calculator, notebook-pen, book-open, plus, check, chevron-*, music-2, timer)

## Màn hình
1. **Lịch nhắc** (tab 1)
   - Lời chào "Chào bé {tên}!", avatar chữ cái đầu
   - Dải tuần 7 ngày (T2..CN), ngày hôm nay tô màu chủ đạo, chấm dưới ngày nào có lịch nhắc
   - Card "Sắp đến giờ · còn N phút" với lời động viên và link "Thêm ảnh của bạn để nhắc con nhé" (hiện khi chưa có ảnh)
   - Danh sách "Lịch nhắc hôm nay" + chip "N đang bật"; mỗi dòng: icon môn, giờ lớn, tên, lịch lặp · thời lượng, công tắc bật/tắt
   - Nút "Thêm lịch nhắc"
2. **Chỉnh lịch nhắc** (mở dạng modal): Hủy; tên lịch nhắc (kèm icon môn); chọn giờ/phút dạng cuộn; lặp lại theo thứ (T2..CN); ảnh khi báo thức reo; lời nhắn cho con (có đếm ký tự); âm thanh; thời lượng học; nút Lưu
3. **Đến giờ học** (toàn màn hình): nhãn "Đến giờ học rồi", giờ lớn, ngày, ảnh phụ huynh toàn màn hình (chưa có ảnh thì hiện ô "Ảnh của phụ huynh" mời thêm ảnh), lời nhắn, nút "Con học ngay!" và "Nhắc lại sau 5 phút"
4. **Ảnh của bạn** (tab 2): quản lý ảnh phụ huynh dùng cho màn báo thức
5. **Cài đặt** (tab 3): tên con, âm thanh mặc định, quyền thông báo
- Điều hướng: iPhone dùng tab bar dưới (Lịch nhắc / Ảnh của bạn / Cài đặt). iPad (màn rộng) dùng thanh bên trái rộng 222px với cùng 3 mục, hồ sơ của con ở cuối thanh bên, nội dung bên phải. Dùng `useWindowDimensions` để chọn bố cục, không hardcode theo tên thiết bị.

## Tech stack
- Expo (SDK mới nhất), TypeScript
- Expo Router để điều hướng
- expo-sqlite để lưu dữ liệu local (hoặc AsyncStorage nếu thấy đủ dùng, hỏi tôi trước khi chọn)
- expo-notifications cho thông báo cục bộ (lặp hàng tuần theo thứ + giờ)
- @react-native-community/datetimepicker (hoặc bộ chọn giờ tự vẽ theo Figma nếu picker mặc định không khớp)
- expo-image-picker để chọn ảnh phụ huynh; ảnh được copy vào thư mục của app bằng expo-file-system để không mất khi thư viện ảnh đổi
- expo-font + @expo-google-fonts/nunito, lucide-react-native + react-native-svg (theo thiết kế)

## Dữ liệu (gợi ý)
- `Reminder`: id, title, subject (toán / tiếng Việt / đọc sách / khác, quyết định icon + màu), hour, minute, weekdays (mảng 0-6), message, photoUri, sound, durationMin, enabled
- `Settings`: childName, defaultSound, snoozeMinutes (mặc định 5)
- Khi sửa, tắt hoặc xóa lịch nhắc: hủy các thông báo đã lên lịch của nó, rồi lên lịch lại. Không để thông báo "mồ côi".

## Quy tắc
- Code đơn giản, dễ đọc, có comment ngắn
- Mỗi màn hình / component một file riêng
- Không thêm thư viện ngoài danh sách trên nếu chưa hỏi tôi
- Trước khi dùng API của Expo, kiểm tra docs.expo.dev vì API thay đổi theo SDK
- Sau mỗi thay đổi, chạy `npx tsc --noEmit` để kiểm tra lỗi kiểu
- Giao diện phải dùng tốt trên cả iPhone và iPad (màn hình rộng)
- Toàn bộ chữ hiển thị bằng tiếng Việt; gom chuỗi vào một file (`src/strings.ts`) để dễ sửa
- So sánh với Figma sau khi làm xong màn hình (khoảng cách, cỡ chữ, màu, bo góc)
- Chữ trên màn "Đến giờ học" phải luôn đọc được trên mọi ảnh (giữ lớp nền mờ dần ở dưới)
- Lưu ý iOS: thông báo cục bộ không tự bật màn hình toàn màn hình khi app đang đóng. Màn "Đến giờ học" hiện khi con bấm vào thông báo hoặc khi app đang mở. Kiểm tra docs trước khi hứa hành vi nào khác với người dùng.

## Tính năng
1. Thêm / sửa / xóa lịch nhắc (tên, môn, giờ, ngày lặp, lời nhắn, ảnh, âm thanh, thời lượng)
2. Thông báo đúng giờ, lặp theo thứ đã chọn
3. Màn "Đến giờ học": "Con học ngay!" (đánh dấu đã học) và "Nhắc lại sau 5 phút"
4. Bật / tắt từng lịch nhắc bằng công tắc
5. Ảnh phụ huynh hiện toàn màn hình khi đến giờ
6. Dữ liệu lưu trên máy, còn sau khi tắt app

## Cách chạy
- `npx expo start`, rồi quét mã QR bằng Camera trên iPhone để mở bằng Expo Go
- Nếu một tính năng không chạy trong Expo Go (ví dụ thông báo, âm thanh tùy chỉnh), báo tôi trước khi chuyển sang development build
