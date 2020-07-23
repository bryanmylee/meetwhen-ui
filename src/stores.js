import { writable } from 'svelte/store';
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

const green = chroma.scale(['BDEFC8', '1C9C83']).mode('lab');
export const colorScale = writable(green);

export const layoutEnum = {
  NARROW: 'NARROW',
  WIDE: 'WIDE',
};
export const layout = writable(layoutEnum.NARROW);
