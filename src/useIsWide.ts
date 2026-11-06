import { useWindowDimensions } from 'react-native';
import { layout } from './theme';

// Màn rộng (iPad) hay hẹp (iPhone), theo chiều rộng chứ không theo tên thiết bị
export function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= layout.wideBreakpoint;
}
