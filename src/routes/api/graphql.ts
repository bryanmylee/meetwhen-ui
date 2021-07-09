import { dev } from '$app/env';
import { env } from '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';

export const post: RequestHandler = async (request) => {
  const cookies = parse(request.headers.cookie ?? '');
  const response = await fetch(env.VITE_API_GQL_ENDPOINT, {
    method: 'post',
    headers: getBackendHeaders(cookies),
    body: request.rawBody,
  });
  const body = await response.json();
  return {
    status: response.status,
    headers: getClientHeaders(request.host, response),
    body,
  };
};

const getBackendHeaders = (cookies: Record<string, string>): Record<string, string> => {
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json',
  };
  if (cookies['access-token'] !== undefined) {
    headers['authorization'] = `Bearer ${cookies['access-token']}`;
  }
  return headers;
};

const getClientHeaders = (host: string, response: Response) => {
  const headers: Record<string, string> = {};
  const token = response.headers.get('__token');
  if (token !== null) {
    headers['set-cookie'] = getSetCookieHeader(host, 'access-token', token);
  }
  return headers;
};

const CLEAR_COOKIE_SIGNAL = '_';

const getSetCookieHeader = (host: string, key: string, value: string) => {
  const SECONDS_IN_WEEK = 604800;
  // Force the cookie to expire.
  const maxAge = value === CLEAR_COOKIE_SIGNAL ? 0 : SECONDS_IN_WEEK;
  const cookieValue = value === CLEAR_COOKIE_SIGNAL ? '' : value;
  const header = `${key}=${cookieValue}; Max-Age=${maxAge}; Path=/; HttpOnly`;
  if (dev) {
    return header;
  }
  return `${header}; Domain=${host}; Secure; SameSite=None`;
};
