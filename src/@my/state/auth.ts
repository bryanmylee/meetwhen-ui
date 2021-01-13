import { writable } from 'svelte/store';
import jwt from 'jsonwebtoken';
import { tokenSecret } from '@my/state/api';
import type Auth from '@my/models/Auth';

const { subscribe, set, update } = writable<Auth>({ user: null, accessToken: null });

const login = (auth: Auth) => {
  console.log('logging in', auth);
  set(auth);
};

const loginWithToken = (token: string) => {
  if (token == null) return;
  let eventUrl: string;
  let username: string;
    try {
      const { evt, uid } = jwt.verify(token, tokenSecret);
      eventUrl = evt;
      username = uid;
    } catch (err) {
      throw new Error('Access token invalid');
    }
    login({
      accessToken: token,
      user: {
        eventUrl,
        username,
      }
    });
};

const logout = () => {
  set(null);
}

export const auth = {
  subscribe,
  login,
  loginWithToken,
  logout,
};

