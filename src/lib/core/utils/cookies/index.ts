import * as cookie from 'cookie';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';
import * as setCookieParser from 'set-cookie-parser';
import { browser } from '$app/env';
import { areCookiesEqual, createCookie } from './helpers';

export { useCookie } from './useCookie';

/**
 * Parses cookies.
 *
 * @param req Request object.
 * @param options Options that we pass down to `cookie` library.
 */
export const parseCookies = (
	req: Maybe<Request>,
	options?: CookieParseOptions,
): Record<string, string> => {
	const cookies = req?.headers.get('Cookie');
	if (cookies != null) {
		return cookie.parse(cookies, options);
	}

	if (browser) {
		return cookie.parse(document.cookie, options);
	}

	return {};
};

/**
 * Sets a cookie.
 *
 * @param res Response object.
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
	/**
	 * Load existing cookies from the header.
	 */
	const setCookie = res?.headers.get('Set-Cookie');
	// SSR
	if (res !== undefined && setCookie != null) {
		/**
		 * Parse cookies but ignore values.
		 */
		const parsedCookies = setCookieParser.parse(setCookie, {
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
		res.headers.set('Set-Cookie', cookiesToSet.join(';'));
	}

	// Browser
	if (browser) {
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
