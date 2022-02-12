export { default as AuthDialog } from './components/authDialog/AuthDialog.svelte';
export { default as AuthCard } from './components/authDialog/AuthCard.svelte';
export type { AuthEvent } from './components/authDialog/AuthCard.svelte';
export { handlePasswordError } from './components/authDialog/utils/handlePasswordError';
export { default as AnonymousJoinDialog } from './components/anonymousJoinDialog/AnonymousJoinDialog.svelte';
export { oAuthSignIn, passwordSignIn } from './utils/handleSignIn';
export { anonymousJoin } from './utils/handleAnonymous';
export { configureUser } from './configureUser';
export type {
	OAuthSignInProps,
	PasswordSignInProps,
} from './utils/handleSignIn';
export { providers } from './providers';
export type { OAuthProviderType } from './providers';
