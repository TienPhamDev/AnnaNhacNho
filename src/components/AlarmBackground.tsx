import { Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

type Props = { photoUri: string | null };

// Nền màn "Đến giờ học": ảnh phụ huynh toàn màn hình (hoặc gradient tím khi chưa có ảnh),
// cộng lớp mờ dần ở dưới (và nhẹ ở trên) để chữ luôn đọc được trên mọi ảnh.
export function AlarmBackground({ photoUri }: Props) {
  const [top, mid, bottom] = colors.alarmGradient;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={top} />
              <Stop offset="0.5" stopColor={mid} />
              <Stop offset="1" stopColor={bottom} />
            </LinearGradient>
          </Defs>
          <Rect width="100" height="100" fill="url(#bg)" />
        </Svg>
      )}
      {/* Lớp mờ dần phía trên, chỉ cần khi có ảnh (giờ + ngày nằm ở trên) */}
      {photoUri && <Fade id="fadeTop" style={styles.topFade} from={0.65} to={0} />}
      {/* Lớp mờ dần phía dưới: từ trong suốt sang màu nền app, giữ lời nhắn và nút dễ đọc */}
      <Fade id="fadeBottom" style={styles.bottomFade} from={0} to={1} />
    </View>
  );
}

// Dải chuyển dần độ đậm của màu nền app theo chiều dọc (id riêng để không trùng nhau trên web)
function Fade({ id, style, from, to }: { id: string; style: object; from: number; to: number }) {
  return (
    <View style={style}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity={from} />
            <Stop offset="1" stopColor={colors.background} stopOpacity={to} />
          </LinearGradient>
        </Defs>
        <Rect width="100" height="100" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: '28%' },
  bottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' },
});
