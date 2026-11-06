import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/build/layouts/Tabs';
import { BellRing, CalendarHeart, ChevronsUpDown, HeartHandshake, Image as ImageIcon, Settings2 } from 'lucide-react-native';
import { colors, fonts, layout, radius } from '../theme';
import { navStrings, sidebarStrings, strings } from '../strings';
import { useSettings } from '../SettingsContext';

// Icon và nhãn cho từng tab, theo đúng thứ tự route
const TABS = {
  index: { label: strings.tabs.reminders, Icon: CalendarHeart },
  photos: { label: strings.tabs.photos, Icon: ImageIcon },
  settings: { label: strings.tabs.settings, Icon: Settings2 },
} as const;

type Props = BottomTabBarProps & { wide: boolean };

// Một thanh điều hướng, hai kiểu hiển thị: tab bar dưới (iPhone) / thanh bên trái (iPad)
export function AppTabBar({ state, emitter, navigateToTab, wide }: Props) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  // Tên con lấy từ Cài đặt; chưa nhập thì dùng chữ tạm
  const name = settings.childName.trim();
  const initial = (name.charAt(0) || navStrings.childFallback.charAt(0)).toUpperCase();

  const items = state.routes.map((route, i) => {
    const tab = TABS[route.name as keyof typeof TABS];
    if (!tab) return null;
    const focused = state.index === i;
    const color = focused ? colors.primary : colors.textSecondary;

    const onPress = () => {
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigateToTab(route.key);
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        style={[wide ? styles.sideItem : styles.bottomItem, wide && focused && styles.sideItemActive]}
      >
        <tab.Icon size={wide ? 22 : 23} color={color} />
        <Text
          style={[
            wide ? styles.sideLabel : styles.bottomLabel,
            { color, fontFamily: focused ? fonts.black : wide ? fonts.bold : fonts.semiBold },
          ]}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  });

  if (wide) {
    return (
      <View style={styles.sidebarWrap}>
        <View style={[styles.sidebar, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.top}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <BellRing size={24} color={colors.textSecondary} />
              </View>
              <Text style={styles.brandText}>{sidebarStrings.brand}</Text>
            </View>
            <View style={styles.sideList}>{items}</View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.note}>
              <HeartHandshake size={26} color={colors.textSecondary} />
              <Text style={styles.noteTitle}>{sidebarStrings.noteTitle}</Text>
              <Text style={styles.noteText}>{sidebarStrings.noteText}</Text>
            </View>
            {/* Hồ sơ của con ở cuối thanh bên */}
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={styles.profileTexts}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {name ? `Bé ${name}` : navStrings.childFallback}
                </Text>
                <Text style={styles.profileSub}>{sidebarStrings.profileSubtitle}</Text>
              </View>
              <ChevronsUpDown size={15} color={colors.textSecondary} />
            </View>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  return <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>{items}</View>;
}

const styles = StyleSheet.create({
  // iPhone: nền trắng, 3 mục rộng 88 dàn đều
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingTop: 12,
    paddingHorizontal: 30,
  },
  bottomItem: { width: 88, alignItems: 'center', gap: 5 },
  bottomLabel: { fontSize: 11 },

  // iPad: thanh bên trắng rộng 222 + đường phân cách 1px
  sidebarWrap: { flexDirection: 'row' },
  sidebar: {
    width: layout.sidebarWidth,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  divider: { width: 1, backgroundColor: colors.divider },
  top: { gap: 37 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: {
    width: 40,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  brandText: { fontFamily: fonts.black, fontSize: 23, color: colors.primary },
  sideList: { gap: 10 },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    paddingHorizontal: 15,
    borderRadius: radius.button,
  },
  sideItemActive: { backgroundColor: colors.primarySoft },
  sideLabel: { fontSize: 16 },

  bottom: { gap: 22 },
  note: { backgroundColor: colors.background, borderRadius: radius.card, padding: 16, gap: 10 },
  noteTitle: { fontFamily: fonts.black, fontSize: 16, lineHeight: 21, color: colors.text },
  noteText: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.black, fontSize: 20, color: colors.text },
  profileTexts: { flex: 1, gap: 1 },
  profileName: { fontFamily: fonts.black, fontSize: 15, color: colors.text },
  profileSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
});
