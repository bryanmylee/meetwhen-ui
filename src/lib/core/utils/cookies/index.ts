import type { Request, Response } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';
import * as setCookieParser from 'set-cookie-parser';
import type { Maybe } from '$lib/core/types/Maybe';
import { areCookiesEqual, createCookie, isBrowser } from './helpers';

/**
 * Parses cookies.
 *
 * @param req SvelteKit Request.
 * @param options Options that we pass down to `cookie` library.
 */
export const parseCookies = (
	req: Maybe<Request>,
	options?: CookieParseOptions,
): Record<string, string> => {
	if (req?.headers.cookie) {
		return cookie.parse(req.headers.cookie, options);
	}

	if (isBrowser()) {
		return cookie.parse(document.cookie, options);
	}

	return {};
};

/**
 * Sets a cookie.
 *
 * @param res SvelteKit Response.
 * @param name The name of your cookie.
 * @param value The value of your cookie.
 * @param options Options that we pass down to `cookie` library.
 */
export const setCookie = (
	res: Maybe<Response>,
	name: string,
	value: string,
	options: CookieSerializeOptions = {},
): void => {
	// SSR
	if (res?.headers !== undefined) {
		/**
		 * Load existing cookies from the header.
		 */
		let cookies = res.headers['Set-Cookie'] ?? [];
		if (typeof cookies === 'string') cookies = [cookies];
		if (typeof cookies === 'number') cookies = [];

		/**
		 * Parse cookies but ignore values.
		 */
		const parsedCookies = setCookieParser.parse(cookies, {
			decodeValues: false,
		});

		/**
		 * We create the new cookie and make sure that none of the existing cookies
		 * match it.
		 */
		const newCookie = createCookie(name, value, options);

		const cookiesToSet: string[] = [];
		parsedCookies.forEach((parsedCookie) => {
			if (areCookiesEqual(parsedCookie, newCookie)) {
				return;
			}
			const serializedCookie = cookie.serialize(
				parsedCookie.name,
				parsedCookie.value,
				{
					encode: (value) => value,
					...(parsedCookie as CookieSerializeOptions),
				},
			);
			cookiesToSet.push(serializedCookie);
		});
		cookiesToSet.push(cookie.serialize(name, value, options));

		/**
		 * Update the header.
		 */
		res.headers['Set-Cookie'] = cookiesToSet;
	}

	// Browser
	if (isBrowser()) {
		if (options && options.httpOnly) {
			throw new Error('Cannot set a httpOnly cookie in the browser');
		}

		document.cookie = cookie.serialize(name, value, options);
	}
};

/**
 * Destroys a cookie with a particular name.
 *
 * @param res SvelteKit Response.
 * @param name Cookie name.
 * @param options Options that we pass down to `cookie` library.
 */
export const destroyCookie = (
	res: Maybe<Response>,
	name: string,
	options?: cookie.CookieSerializeOptions,
): void => {
	/**
	 * We forward the request destroy to setCookie function
	 * as it is the same function with modified maxAge value.
	 */
	return setCookie(res, name, '', { ...(options || {}), maxAge: -1 });
};
