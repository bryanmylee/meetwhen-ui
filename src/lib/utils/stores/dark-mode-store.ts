import { BOOLEAN, useLocal } from '$lib/utils/stores/local-storage-store';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useDarkMode = (): [Readable<boolean>, Writable<boolean | undefined>] => {
  const updateDocument = (isDark: boolean): void => {
    if (typeof document === 'undefined') {
      return;
    }
    mediaIsDark.set(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const darkChangeHandler = (event: MediaQueryListEvent) => {
    updateDocument(event.matches);
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

  const darkModeSetting = useLocal<boolean | undefined>('dark', { code: BOOLEAN });
  const mediaIsDark = writable(false);

  darkModeSetting.subscribe(($darkModeSetting) => {
    if ($darkModeSetting === undefined) {
      attachDarkMediaListener();
    } else {
      detachDarkMediaListener();
      updateDocument($darkModeSetting);
    }
  });

  const update = (fn: (setting: boolean | undefined) => boolean | undefined) => {
    darkModeSetting.update(($darkModeSetting) => {
      const newDarkModeSetting = fn($darkModeSetting);
      if (newDarkModeSetting === undefined) {
        attachDarkMediaListener();
      } else {
        detachDarkMediaListener();
        updateDocument(newDarkModeSetting);
      }
      return newDarkModeSetting;
    });
  };

  return [
    {
      subscribe: mediaIsDark.subscribe,
    },
    {
      subscribe: darkModeSetting.subscribe,
      update,
      set: (darkModeSetting: boolean | undefined) => update(() => darkModeSetting),
    },
  ];
};
