import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

export const useTouchEnabled = (): Readable<boolean> => {
  if (typeof document === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return readable(false, () => {});
  }
  return readable<boolean>(false, (set) => {
    const handleTouch = () => set(true);
    const handleMouse = () => set(false);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mousedown', handleMouse);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleMouse);
    };
  });
};
