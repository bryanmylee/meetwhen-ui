import { writable } from "svelte/store";
import jwt from "jsonwebtoken";
import { baseUrl, tokenSecret } from "@/state/api";
import type Auth from "@/models/Auth";
import type Pending from "@/models/Pending";
import type { AuthResponse } from "@/models/Response";

const { subscribe, set, update } = writable<Pending<Auth>>({
  pending: false,
  data: null,
});

const loginWithPassword = async (
  username: string,
  password: string,
  eventUrl: string
) => {
  if (typeof fetch === "undefined") return;

  update(($auth) => ({ ...$auth, pending: true }));

  const res = await fetch([baseUrl, eventUrl, "login"].join("/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = (await res.json()) as AuthResponse;

  if (data.error == null) {
    update(($auth) => ({
      ...$auth,
      data: {
        ...data,
        eventUrl,
        username,
      },
    }));
  }
  update(($auth) => ({ ...$auth, pending: false }));
  return data;
};

const loginWithToken = (token: string) => {
  if (token == null) return;

  update(($auth) => ({ ...$auth, pending: true }));

  let eventUrl: string;
  let username: string;
  try {
    const { evt, uid } = jwt.verify(token, tokenSecret);
    eventUrl = evt;
    username = uid;
  } catch (err) {
    update(($auth) => ({ ...$auth, pending: false }));
    throw new Error("Access token invalid");
  }

  set({
    pending: false,
    data: {
      username,
      eventUrl,
      accessToken: token,
    },
  });
};

const logout = () => {
  set({ pending: false, data: null });
};

export const auth = {
  subscribe,
  loginWithPassword,
  loginWithToken,
  logout,
};
