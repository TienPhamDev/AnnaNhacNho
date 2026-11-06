import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { AppTabBar } from '../../src/components/AppTabBar';
import { layout } from '../../src/theme';

// Chọn bố cục theo chiều rộng màn hình, không theo tên thiết bị
export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const wide = width >= layout.wideBreakpoint;

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} wide={wide} />}
      screenOptions={{ headerShown: false, tabBarPosition: wide ? 'left' : 'bottom' }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="photos" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
