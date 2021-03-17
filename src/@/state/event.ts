import { writable, get as getOnce } from "svelte/store";
import { baseUrl } from "@/state/api";
import { fromEvent, toEvent } from "@/models/EventTransferObject";
import { fromInterval } from "@/models/IntervalTransferObject";
import { fromUser } from "@/models/NewUserTransferObject";
import type { Readable } from "svelte/store";
import type Auth from "@/models/Auth";
import type Event from "@/models/Event";
import type EventTransferObject from "@/models/EventTransferObject";
import type Interval from "@/models/Interval";
import type Pending from "@/models/Pending";
import type User from "@/models/User";
import type { AuthResponse } from "@/models/Response";

export interface EventLoadable {
  get: (id: string) => Promise<EventTransferObject>;
  post: (data: Partial<Event>) => Promise<EventTransferObject>;
  addUser: (data: User) => Promise<AuthResponse>;
  editUserSchedule: (
    auth: Auth,
    newSchedule: Interval[]
  ) => Promise<AuthResponse>;
}

const { subscribe, set, update } = writable<Pending<Event>>({
  pending: false,
  data: null,
});

const get = async (eventUrl: string) => {
  if (typeof fetch === "undefined") return;
  update(($event) => ({ ...$event, pending: true }));

  const res = await fetch([baseUrl, eventUrl].join("/"));

  if (res.status === 404) {
    set({ pending: false, data: null });
    return null;
  }

  const data = (await res.json()) as EventTransferObject;

  const event = toEvent(data);
  set({ pending: false, data: event });
  return data;
};

const post = async (event: Event) => {
  if (typeof fetch === "undefined") return;
  set({ pending: true, data: event });

  const res = await fetch([baseUrl, "new"].join("/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fromEvent(event)),
  });
  const data = (await res.json()) as EventTransferObject;

  const addedEvent = { ...event, eventUrl: data.eventUrl };
  set({ pending: false, data: addedEvent });
  return data;
};

const addUser = async (newUser: User) => {
  if (typeof fetch === "undefined") return;
  const { eventUrl } = getOnce(event).data;
  if (eventUrl == null || newUser.eventUrl !== eventUrl) {
    return null;
  }
  update(($event) => ({ ...$event, pending: true }));

  const res = await fetch([baseUrl, eventUrl, "new-user"].join("/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fromUser(newUser)),
  });
  const data = (await res.json()) as AuthResponse;

  if (data.error == null) {
    update(($event) => ({
      ...$event,
      data: {
        ...$event.data,
        users: {
          ...$event.data.users,
          [newUser.username]: newUser.schedule,
        },
      },
    }));
  }

  update(($event) => ({ ...$event, pending: false }));

  return data;
};

const editUserSchedule = async (auth: Auth, newSchedule: Interval[]) => {
  if (typeof fetch === "undefined") return;
  if (auth == null) return;
  const { eventUrl } = getOnce(event).data;
  if (eventUrl == null || auth.eventUrl !== eventUrl) {
    return null;
  }
  update(($event) => ({ ...$event, pending: true }));

  const { username, accessToken } = auth;
  const res = await fetch([baseUrl, eventUrl, username, "edit"].join("/"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      newSchedule: newSchedule.map(fromInterval),
    }),
  });
  const data = (await res.json()) as AuthResponse;

  if (data.error == null) {
    update(($event) => ({
      ...$event,
      data: {
        ...$event.data,
        users: {
          ...$event.data.users,
          [username]: newSchedule,
        },
      },
    }));
  }

  update(($event) => ({ ...$event, pending: false }));

  return data;
};

export const event: Readable<Pending<Event>> & EventLoadable = {
  subscribe,
  get,
  post,
  addUser,
  editUserSchedule,
};
