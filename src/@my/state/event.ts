import { writable } from 'svelte/store';
import { baseUrl } from '@my/state/api';
import { fromEvent, toEvent } from '@my/models/EventTransferObject';
import { fromUser } from '@my/models/NewUserTransferObject';
import type { Readable } from 'svelte/store';
import type Event from '@my/models/Event';
import type EventTransferObject from '@my/models/EventTransferObject';
import type Pending from '@my/models/Pending';
import type User from '@my/models/User';
import type { AuthResponse } from '@my/models/Response';

export interface EventLoadable {
  get: (id: string) => Promise<EventTransferObject>,
  post: (data: Partial<Event>) => Promise<EventTransferObject>,
  addUser: (data: User) => Promise<AuthResponse>;
}

const { subscribe, set, update } = writable<Pending<Event>>({ pending: false, data: null });

const get = async (eventUrl: string) => {
  if (typeof fetch === 'undefined') return;

  update($event => ({ ...$event, pending: true }));

  const res = await fetch([baseUrl, eventUrl].join('/'));
  const data = await res.json() as EventTransferObject;

  const event = toEvent(data);
  set({ pending: false, data: event });
  return data;
};

const post = async (event: Event) => {
  if (typeof fetch === 'undefined') return;

  set({ pending: true, data: event });

  const res = await fetch([baseUrl, 'new'].join('/'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fromEvent(event)),
  });
  const data = await res.json() as EventTransferObject;

  const addedEvent = { ...event, eventUrl: data.eventUrl };
  set({ pending: false, data: addedEvent });
  return data;
};

const addUser = async (newUser: User) => {
  if (typeof fetch === 'undefined') return;
  update($event => ({ ...$event, pending: true }));

  let eventUrl: string;
  subscribe((event) => {
    eventUrl = event.data.eventUrl;
  })();
  if (eventUrl == null || newUser.eventUrl !== eventUrl) {
    return null;
  }
  const res = await fetch([baseUrl, eventUrl, 'new-user'].join('/'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fromUser(newUser)),
  });
  const data = await res.json() as AuthResponse;

  if (data.error == null) {
    update($event => ({
      ...$event,
      data: {
        ...$event.data,
        users: {
          ...$event.data.users,
          [newUser.username]: newUser.schedule,
        }
      }
    }));
  }

  update($event => ({ ...$event, pending: false }));

  return data;
};

export const event: Readable<Pending<Event>> & EventLoadable = {
  subscribe,
  get,
  post,
  addUser,
};

