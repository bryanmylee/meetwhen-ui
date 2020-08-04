import { writable, derived } from 'svelte/store';
import jwt from 'jsonwebtoken';

import { colors, hexToScale, hexToGradientDark } from 'src/utils/colors';

/**
 * Create a user store which can only be updated by setting an access token.
 */
function getUser() {
  const user = writable({
    isLoggedIn: false,
    accessToken: null,
    eventUrl: null,
    username: null,
    isAdmin: false,
  });

  const setAccessToken = (accessToken, secret) => {
    if (accessToken == null || secret == null) return;
    try {
      const { evt, uid, adm } = jwt.verify(accessToken, secret);
      user.set({
        accessToken,
        eventUrl: evt,
        username: uid,
        isAdmin: adm,
        isLoggedIn: true,
      });
    } catch (err) {
      throw new Error('Access token invalid');
    }
  };

  const logout = () => {
    user.set({
      isLoggedIn: false,
    });
  };

  return {
    subscribe: user.subscribe,
    setAccessToken,
    logout,
  };
}
export const user = getUser();

const currentBaseColor = writable(colors.blue500);

const colorScale = derived(currentBaseColor, ({ hex }) => hexToScale(hex));

const gradientDark = derived(currentBaseColor, ({ hex }) => hexToGradientDark(hex));

const color = derived(
  [currentBaseColor, colorScale, gradientDark],
  ([$currentBaseColor, $colorScale, $gradientDark]) => ({
    ...$currentBaseColor,
    gradientDark: $gradientDark,
    scale: $colorScale,
  }),
);

let colorIndex = 0;
export const currentColor = {
  subscribe: color.subscribe,
  setBaseColor: (newColor) => currentBaseColor.set(newColor),
  setBaseColorHex: (newHex) => currentBaseColor.set({ tint: 500, hex: newHex, name: '' }),
  nextColor: () => {
    currentBaseColor.set(
      Object.values(colors)[++colorIndex % Object.keys(colors).length],
    );
  },
};

export const layoutEnum = {
  NARROW: 'NARROW',
  WIDE: 'WIDE',
};
export const layout = writable(layoutEnum.NARROW);

export const isDarkMode = writable(false);
