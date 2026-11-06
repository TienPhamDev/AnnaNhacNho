import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlarmClock, ChevronRight, ImagePlus } from 'lucide-react-native';
import { colors, fonts, radius } from '../theme';
import { homeStrings } from '../strings';
import { SUBJECTS, formatMinutesLeft } from '../reminderUtils';
import { formatTime } from '../dateUtils';
import type { Reminder } from '../types';

type Props = {
  next: { reminder: Reminder; minutesLeft: number } | null;
  hasPhotos: boolean;
  wide: boolean;
  onAddPhoto: () => void;
};

// Card tím nhạt "Sắp đến giờ · còn N phút" với lời động viên
export function NextReminderCard({ next, hasPhotos, wide, onAddPhoto }: Props) {
  const label = next
    ? `${homeStrings.upNext} · ${homeStrings.minutesLeft(formatMinutesLeft(next.minutesLeft))}`
    : homeStrings.today;
  const title = next ? SUBJECTS[next.reminder.subject].cheer : homeStrings.nothingLeft;

  return (
    <View style={[styles.card, wide && styles.cardWide]}>
      <View style={styles.main}>
        <View style={[styles.texts, wide && styles.textsWide]}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.title, wide && styles.titleWide]}>{title}</Text>
          {wide && next && (
            <Text style={styles.detail}>
              {`${formatTime(next.reminder.hour, next.reminder.minute)} · ${next.reminder.title} · ${homeStrings.minutes(next.reminder.durationMin)}`}
            </Text>
          )}
        </View>
        {/* Ô vàng nghiêng 8 độ với icon đồng hồ */}
        <View style={[styles.clockTile, wide && styles.clockTileWide]}>
          <AlarmClock size={wide ? 46 : 32} color={colors.textSecondary} />
        </View>
      </View>
      {/* iPad có card ảnh riêng bên cạnh nên chỉ iPhone hiện link này */}
      {!wide && !hasPhotos && (
        <Pressable onPress={onAddPhoto} style={styles.link} accessibilityRole="button">
          <ImagePlus size={15} color={colors.primary} />
          <Text style={styles.linkText}>{homeStrings.addPhotoLink}</Text>
          <ChevronRight size={14} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: radius.card, padding: 18, gap: 13, width: '100%' },
  cardWide: { flex: 1, width: undefined, padding: 23, justifyContent: 'center' },
  main: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  texts: { flex: 1, gap: 5 },
  textsWide: { gap: 7 },
  label: { fontFamily: fonts.black, fontSize: 11, color: colors.primary },
  title: { fontFamily: fonts.black, fontSize: 20, lineHeight: 24, color: colors.text },
  titleWide: { fontSize: 24, lineHeight: 29 },
  detail: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
  clockTile: {
    width: 58,
    height: 66,
    borderRadius: 20,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
    marginHorizontal: 4,
  },
  clockTileWide: { width: 83, height: 95, borderRadius: 26, marginHorizontal: 6 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  linkText: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.primary },
});
