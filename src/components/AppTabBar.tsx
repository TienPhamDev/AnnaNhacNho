import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/build/layouts/Tabs';
import { BellRing, Image as ImageIcon, Settings2 } from 'lucide-react-native';
import { colors, fonts, layout, radius } from '../theme';
import { navStrings, strings } from '../strings';

// Icon và nhãn cho từng tab, theo đúng thứ tự route
const TABS = {
  index: { label: strings.tabs.reminders, Icon: BellRing },
  photos: { label: strings.tabs.photos, Icon: ImageIcon },
  settings: { label: strings.tabs.settings, Icon: Settings2 },
} as const;

type Props = BottomTabBarProps & { wide: boolean };

// Một thanh điều hướng, hai kiểu hiển thị: tab bar dưới (iPhone) / thanh bên trái (iPad)
export function AppTabBar({ state, emitter, navigateToTab, wide }: Props) {
  const insets = useSafeAreaInsets();

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
        <tab.Icon size={wide ? 22 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />
        <Text style={[wide ? styles.sideLabel : styles.bottomLabel, { color }]}>{tab.label}</Text>
      </Pressable>
    );
  });

  if (wide) {
    return (
      <View style={[styles.sidebar, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.brand}>{strings.appName}</Text>
        <View style={styles.sideList}>{items}</View>
        {/* Hồ sơ của con ở cuối thanh bên */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{navStrings.childFallback.charAt(0)}</Text>
          </View>
          <Text style={styles.profileText}>{navStrings.childLabel}</Text>
        </View>
      </View>
    );
  }

  return <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>{items}</View>;
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  bottomItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  bottomLabel: { fontFamily: fonts.bold, fontSize: 12 },

  sidebar: {
    width: layout.sidebarWidth,
    backgroundColor: colors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
    paddingHorizontal: 16,
  },
  brand: { fontFamily: fonts.black, fontSize: 20, color: colors.text, marginBottom: 24, paddingHorizontal: 8 },
  sideList: { flex: 1, gap: 8 },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  sideItemActive: { backgroundColor: colors.primarySoft },
  sideLabel: { fontFamily: fonts.bold, fontSize: 16 },

  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.text },
  profileText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textSecondary },
});
