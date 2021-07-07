import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

export const useTouchEnabled = (): Readable<boolean> => {
  if (typeof document === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return readable(false, () => {});
  }
  return readable<boolean>(false, (set) => {
    const handleTouch = () => {
      set(true);
      window.removeEventListener('touchstart', handleTouch);
    };

    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  });
};
