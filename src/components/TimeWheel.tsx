import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { colors, fonts } from '../theme';

const ITEM = 38; // chiều cao mỗi số
const VISIBLE = 3; // hiện 3 số: trước, đang chọn, sau
const BAND = 52; // ô tím nhạt quanh số đang chọn

type Props = { count: number; value: number; onChange: (value: number) => void; accessibilityLabel: string };

// Bộ chọn cuộn dọc (giờ hoặc phút): cuộn, hoặc bấm vào số bên cạnh để chọn
export function TimeWheel({ count, value, onChange, accessibilityLabel }: Props) {
  const ref = useRef<ScrollViewInstance>(null);
  const positioned = useRef(false);

  // Đặt vị trí cuộn ban đầu đúng giá trị hiện tại (một lần, sau khi nội dung đã đo xong)
  const onContentSizeChange = () => {
    if (positioned.current) return;
    positioned.current = true;
    ref.current?.scrollTo({ y: value * ITEM, animated: false });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.min(count - 1, Math.max(0, Math.round(e.nativeEvent.contentOffset.y / ITEM)));
    if (index !== value) onChange(index);
  };

  return (
    <View style={styles.wheel} accessibilityLabel={accessibilityLabel}>
      <View style={styles.band} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        // Thêm một ô đệm hai đầu để số đầu / cuối cũng nằm giữa được
        contentContainerStyle={{ paddingVertical: ITEM }}
      >
        {Array.from({ length: count }, (_, i) => {
          const selected = i === value;
          return (
            <Pressable
              key={i}
              style={styles.item}
              onPress={() => ref.current?.scrollTo({ y: i * ITEM, animated: true })}
              accessibilityRole="adjustable"
            >
              <Text style={selected ? styles.selected : styles.other}>{String(i).padStart(2, '0')}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: { width: 94, height: ITEM * VISIBLE },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ITEM * VISIBLE - BAND) / 2,
    height: BAND,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  item: { height: ITEM, alignItems: 'center', justifyContent: 'center' },
  selected: { fontFamily: fonts.black, fontSize: 40, lineHeight: 44, color: colors.primary },
  other: { fontFamily: fonts.bold, fontSize: 23, color: colors.wheelMuted },
});
