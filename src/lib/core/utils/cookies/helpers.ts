import type { CookieSerializeOptions } from 'cookie';
import type { Cookie } from 'set-cookie-parser';

/**
 * Create an instance of the Cookie interface
 */
export const createCookie = (
	name: string,
	value: string,
	options: CookieSerializeOptions,
): Cookie => {
	let sameSite = options.sameSite;
	if (sameSite === true) {
		sameSite = 'strict';
	}
	if (sameSite === undefined || sameSite === false) {
		sameSite = 'lax';
	}
	const cookieToSet = { ...options, sameSite: sameSite };
	delete cookieToSet.encode;
	return {
		name: name,
		value: value,
		...cookieToSet,
	};
};

/**
 * Tells whether given objects have the same properties.
 */
export const hasSameProperties = (
	a: Record<string, unknown>,
	b: Record<string, unknown>,
): boolean => {
	const aProps = Object.getOwnPropertyNames(a);
	const bProps = Object.getOwnPropertyNames(b);

	if (aProps.length !== bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		const propName = aProps[i];

		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	return true;
};

/**
 * Compare the cookie and return true if the cookies have equivalent
 * options and the cookies would be overwritten in the browser storage.
 *
 * @param a first Cookie for comparison
 * @param b second Cookie for comparison
 */
export const areCookiesEqual = (a: Cookie, b: Cookie): boolean => {
	let sameSiteSame = a.sameSite === b.sameSite;
	if (typeof a.sameSite === 'string' && typeof b.sameSite === 'string') {
		sameSiteSame = a.sameSite.toLowerCase() === b.sameSite.toLowerCase();
	}

	return (
		hasSameProperties(
			{ ...a, sameSite: undefined },
			{ ...b, sameSite: undefined },
		) && sameSiteSame
	);
};
