/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
import type { SafeUser } from '$lib/models/SafeUser';
import type { ThemeType } from '$lib/core/types/ThemeType';

declare global {
	declare namespace App {
		interface Locals {}

		interface Platform {}

		interface Session {
			user?: SafeUser;
			theme?: ThemeType;
		}

		interface Stuff {}
	}
}
