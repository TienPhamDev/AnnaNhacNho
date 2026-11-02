import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = { value: boolean; onValueChange: (value: boolean) => void; accessibilityLabel?: string };

// Công tắc theo Figma (44×27): tím khi bật, xám khi tắt
export function ToggleSwitch({ value, onValueChange, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 27, borderRadius: radius.pill, padding: 3, justifyContent: 'center' },
  trackOn: { backgroundColor: colors.primary },
  trackOff: { backgroundColor: colors.switchOff },
  knob: {
    width: 21,
    height: 21,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  knobOn: { alignSelf: 'flex-end' },
});
