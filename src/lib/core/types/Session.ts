import type { SafeUser } from '$lib/models/SafeUser';
import type { ThemeType } from './ThemeType';

export interface Session {
	user?: SafeUser;
	theme?: ThemeType;
}
