import { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

// Chuông báo thức (assets/sounds/chime.wav), phát lặp lại khi màn "Đến giờ học" đang mở
const CHIME = require('../assets/sounds/chime.wav');

// `active` = true thì reo cho đến khi `active` thành false hoặc màn hình đóng
export function useAlarmSound(active: boolean) {
  const player = useAudioPlayer(CHIME);

  useEffect(() => {
    if (!active) return;
    // Công tắc im lặng bên hông iPhone không được tắt chuông báo thức
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    player.loop = true;
    player.play();
    return () => player.pause();
  }, [active, player]);
}
