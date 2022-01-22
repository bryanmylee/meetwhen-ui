import type { SafeUser } from '$lib/core/types/SafeUser';
import type { ThemeType } from './ThemeType';

export interface Session {
	user?: SafeUser;
	theme?: ThemeType;
}
