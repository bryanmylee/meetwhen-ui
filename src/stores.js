import { writable, derived } from 'svelte/store';
import chroma from 'chroma-js';
import jwt from 'jsonwebtoken';

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

export const colors = {
  blue500: { tint: 500, hex: '2196F3', name: 'Blue' },
  cyan500: { tint: 500, hex: '00BCD4', name: 'Cyan' },
  teal500: { tint: 500, hex: '009688', name: 'Teal' },
  green500: { tint: 500, hex: '4CAF50', name: 'Green' },
  lightGreen500: { tint: 500, hex: '8BC34A', name: 'Light Green' },
  lime500: { tint: 500, hex: 'CDDC39', name: 'Lime' },
  amber500: { tint: 500, hex: 'FFC107', name: 'Amber' },
  orange700: { tint: 700, hex: 'F57C00', name: 'Orange' },
  deepOrange500: { tint: 500, hex: 'FF5722', name: 'Deep Orange' },
  grey500: { tint: 500, hex: '9E9E9E', name: 'Grey' },
  blueGrey500: { tint: 500, hex: '607D8B', name: 'Blue Grey' },
  red600: { tint: 600, hex: 'E53935', name: 'Red' },
  pink400: { tint: 400, hex: 'EC407A', name: 'Pink' },
  purple500: { tint: 500, hex: '9C27B0', name: 'Purple' },
  deepPurple500: { tint: 500, hex: '673AB7', name: 'Deep Purple' },
  indigo500: { tint: 500, hex: '3F51B5', name: 'Indigo' },
};

function hexToScale(baseHex) {
  const base = chroma(baseHex);
  const light = base.brighten(1.5).desaturate();
  const dark = base.darken(1);
  return chroma.scale([light, base, dark]).mode('lrgb');
}

const currentBaseColor = writable(colors.blue500);
const colorScale = derived(currentBaseColor, ($current) => ({
  ...$current,
  scale: hexToScale($current.hex),
}));

let colorIndex = 0;
export const currentColor = {
  subscribe: colorScale.subscribe,
  setBaseColor: (color) => currentBaseColor.set(color),
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
