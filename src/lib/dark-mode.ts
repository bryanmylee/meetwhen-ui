import { BOOLEAN, useLocal } from '$lib/utils/local-storage-store';
import type { Writable } from 'svelte/store';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const useDarkMode = (): Writable<boolean> => {
  const isDarkLocal = useLocal('dark', { code: BOOLEAN });

  isDarkLocal.subscribe(($isDarkLocal) => {
    if ($isDarkLocal === undefined) {
      attachDarkMediaListener();
    } else {
      detachDarkMediaListener();
      updateDocument($isDarkLocal);
    }
  });

  const update = (fn: (d: boolean) => boolean) => {
    isDarkLocal.update(($isDarkLocal) => {
      const newIsDark = fn($isDarkLocal);
      if (newIsDark === undefined) {
        attachDarkMediaListener();
      } else {
        detachDarkMediaListener();
        updateDocument(newIsDark);
      }
      return newIsDark;
    });
  };

  return {
    subscribe: isDarkLocal.subscribe,
    update,
    set: (newIsDark: boolean) => update(() => newIsDark),
  };
};

const attachDarkMediaListener = () => {
  if (typeof window === 'undefined') {
    return;
  }
  updateDocument(window.matchMedia(MEDIA_QUERY).matches);
  window.matchMedia(MEDIA_QUERY).addEventListener('change', darkChangeHandler);
};

const detachDarkMediaListener = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.matchMedia(MEDIA_QUERY).removeEventListener('change', darkChangeHandler);
};

const darkChangeHandler = (event: MediaQueryListEvent) => {
  updateDocument(event.matches);
};

const updateDocument = (isDark: boolean): void => {
  if (typeof document === 'undefined') {
    return;
  }
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const isDark = useDarkMode();
