import { env } from '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (request) => {
  const cookies = getCookies(request.headers.cookie);
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

const getCookies = (rawCookie: string): Record<string, string> => {
  return Object.fromEntries(
    rawCookie.split('; ').map((rawCookieEntry: string) => rawCookieEntry.split('='))
  );
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

const getSetCookieHeader = (host: string, key: string, value: string) => {
  const header = `${key}=${value}; Path=/; Max-Age=604800; Secure; HttpOnly; SameSite=None`;
  if (host.startsWith('localhost')) {
    return header;
  }
  return `${header}; Domain=${host}`;
};
