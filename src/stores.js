import { writable } from 'svelte/store';
import chroma from 'chroma-js';
import jwt from 'jsonwebtoken';

function getUser() {
  const user = writable({
    isLoggedIn: false,
  });

  const setAccessToken = (accessToken, secret) => {
    if (accessToken == null) throw new Error('Access token not defined');
    if (secret == null) throw new Error('Secret not defined');
    try {
      const { evt, uid, adm } = jwt.verify(accessToken, secret);
      user.set({
        eventUrl: evt,
        username: uid,
        isAdmin: adm,
        isLoggedIn: true,
      });
    } catch (err) {
      throw new Error('Access token invalid');
    }
  }

  return ({
    subscribe: user.subscribe,
    setAccessToken,
  });
}

export const user = getUser();

const colors = ['GnBu', 'BuGn', 'PuBuGn', 'PuRd', 'YlOrRd'];
function getColorScale(initialColors = colors[0]) {
  const scale = writable(chroma.scale(initialColors));
  return ({
    subscribe: scale.subscribe,
    set: (colors) => scale.set(chroma.scale(colors)),
  });
}

export const colorScale = getColorScale();