export { default as AuthDialog } from './components/authDialog/AuthDialog.svelte';
export { default as AuthCard } from './components/authDialog/AuthCard.svelte';
export type { AuthEvent } from './components/authDialog/AuthCard.svelte';
export { default as PasscodeDialog } from './components/passcodeDialog/PasscodeDialog.svelte';
export { handlePasswordError } from './components/authDialog/utils/handlePasswordError';
export { default as GuestJoinDialog } from './components/guestJoinDialog/GuestJoinDialog.svelte';
export { default as GuestReturningDialog } from './components/guestJoinDialog/GuestReturningDialog.svelte';
export type { GuestReturningEvent } from './components/guestJoinDialog/GuestReturningDialog.svelte';
export { default as GuestSignOutDialog } from './components/guestSignOutDialog/GuestSignOutDialog.svelte';
export { oAuthSignIn, passwordSignIn } from './utils/handleSignIn';
export { guestJoin, guestLeave } from './utils/handleGuest';
export { configureUser } from './configureUser';
export type {
	OAuthSignInProps,
	PasswordSignInProps,
} from './utils/handleSignIn';
export { providers } from './providers';
export type { OAuthProviderType } from './providers';
