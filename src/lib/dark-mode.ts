import { writable, Writable } from 'svelte/store';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const updateLocalStorageIsDark = (isDark?: boolean): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  if (isDark === null) {
    delete localStorage['dark'];
    return;
  }
  localStorage['dark'] = isDark;
};

const getLocalStorageIsDark = (): boolean => {
  if (typeof localStorage === 'undefined' || !('dark' in localStorage)) {
    return null;
  }
  return localStorage['dark'] === 'true';
};

const useDarkMode = (initIsDark?: boolean): Writable<boolean> => {
  const isDark = writable(initIsDark);
  if (initIsDark === null) {
    if (typeof window !== 'undefined') {
      updateDocument(window.matchMedia(MEDIA_QUERY).matches);
    }
    attachDarkMediaListener();
  } else {
    updateDocument(initIsDark);
  }

  const update = (fn: (b: boolean) => boolean) => {
    isDark.update(($isDark) => {
      const newIsDark = fn($isDark);
      updateLocalStorageIsDark(newIsDark);
      if (newIsDark === null) {
        attachDarkMediaListener();
      } else {
        detachDarkMediaListener();
        updateDocument(newIsDark);
      }
      return newIsDark;
    });
  };

  return {
    subscribe: isDark.subscribe,
    update,
    set: (newIsDark: boolean) => update(() => newIsDark),
  };
};

const darkChangeHandler = (event: MediaQueryListEvent) => {
  updateDocument(event.matches);
};

const attachDarkMediaListener = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.matchMedia(MEDIA_QUERY).addEventListener('change', darkChangeHandler);
};

const detachDarkMediaListener = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.matchMedia(MEDIA_QUERY).removeEventListener('change', darkChangeHandler);
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

export const isDarkMode = useDarkMode(getLocalStorageIsDark());
