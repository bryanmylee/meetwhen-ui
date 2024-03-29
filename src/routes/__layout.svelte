<script lang="ts" context="module">
	export const load: Load = async ({ session }) => {
		const { firebaseConfig } = getClientEnv();
		initFirebaseClient(firebaseConfig);
		return {
			props: {
				initTheme: session.theme ?? 'auto',
			},
		};
	};
</script>

<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { page, session } from '$app/stores';
	import { FirebaseError } from 'firebase/app';
	import { getClientEnv } from '$lib/env';
	import {
		activeMeeting,
		isAuthOpen,
		isGuestAuthOpen,
		primaryVars,
		setIsDark,
		setTheme,
	} from '$lib/core/state';
	import { initFirebaseClient, firebaseClient } from '$lib/firebase';
	import {
		setFirebaseApp,
		setFirebaseAuth,
		setRepo,
		setUser,
	} from '$lib/firebase/context';
	import type { ThemeType } from '$lib/core/types';
	import { useCookie } from '$lib/core/utils/cookies';
	import { useScreenHeight, withError } from '$lib/core/utils';
	import { Nav } from '$lib/core/components/nav';
	import {
		AuthDialog,
		configureUser,
		oAuthSignIn,
		passwordSignIn,
		handlePasswordError,
		GuestReturningDialog,
	} from '$lib/auth';
	import type { AuthEvent, GuestReturningEvent } from '$lib/auth';
	import { useDarkMode } from '$lib/colors/utils/useDarkMode';
	import { guestSignIn } from '$lib/auth/utils/handleGuest';
	import { setLoading, withLoading } from '$lib/loading';

	export let initTheme: ThemeType;
	const theme = useCookie('theme', initTheme);
	setTheme(theme);
	const isDark = useDarkMode(theme);
	setIsDark(isDark);
	const screenHeight = useScreenHeight();
	$: vh = $screenHeight === undefined ? '' : `--vh:${$screenHeight}px;`;

	setFirebaseApp(firebaseClient.app);
	setFirebaseAuth(firebaseClient.auth);
	setRepo(firebaseClient.repo);

	const user = configureUser(firebaseClient.auth, $session);
	setUser(user);

	const name = withError('');
	const email = withError('');
	const password = withError('');
	const passcode = withError('');

	const isLoading = writable(false);
	setLoading(isLoading);

	const _handlePasswordSignIn = async ({
		detail,
	}: CustomEvent<AuthEvent['password-signin']>) => {
		if ($user?.ssr) {
			return;
		}
		try {
			await passwordSignIn(firebaseClient.auth, {
				currentUser: $user,
				email: detail.email,
				password: detail.password,
			});
			onSignIn();
		} catch (error) {
			console.error(error);
			if (error instanceof FirebaseError) {
				handlePasswordError({
					code: error.code,
					name,
					email,
					password,
				});
			}
		}
	};
	const handlePasswordSignIn = withLoading(isLoading, _handlePasswordSignIn);

	const _handleOAuthSignIn = async ({
		detail,
	}: CustomEvent<AuthEvent['oauth-signin']>) => {
		if ($user?.ssr) {
			return;
		}
		await oAuthSignIn(firebaseClient.auth, {
			currentUser: $user,
			providerType: detail.providerType,
		});
		onSignIn();
	};
	const handleOAuthSignIn = withLoading(isLoading, _handleOAuthSignIn);

	const _handleGuestSignIn = async ({
		detail,
	}: CustomEvent<GuestReturningEvent['guest-sign-in']>) => {
		if ($user?.ssr || $activeMeeting === undefined) {
			return;
		}
		try {
			await guestSignIn(firebaseClient.auth, firebaseClient.repo, {
				meetingId: $activeMeeting.id,
				passcode: detail.passcode,
			});
			onSignIn();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				$passcode.error = error.message;
			}
		}
	};

	const handleGuestSignIn = withLoading(isLoading, _handleGuestSignIn);

	const onSignIn = () => {
		$isAuthOpen = false;
		$isGuestAuthOpen = false;
		if ($page.url.pathname === '/') {
			goto('/profile');
		}
	};

	$: onHomePage = $page.url.pathname === '/';
</script>

<!-- ; forces string interpolation during SSR and prevents incorrect rendering of escape sequences -->
<div id="root" style="{$primaryVars};{vh}" class:dark={$isDark}>
	<Nav
		user={$user}
		theme={$theme}
		{onHomePage}
		on:open-auth={() => ($isAuthOpen = true)}
		on:select-theme={(e) => ($theme = e.detail.theme)}
	/>
	<main class:mt-14={!onHomePage}>
		<slot />
	</main>
	<AuthDialog
		{name}
		{email}
		{password}
		hasMeeting={$activeMeeting !== undefined}
		bind:open={$isAuthOpen}
		on:password-signin={handlePasswordSignIn}
		on:oauth-signin={handleOAuthSignIn}
		on:show-guest-signin={() => {
			$isAuthOpen = false;
			$isGuestAuthOpen = true;
		}}
	/>
	<GuestReturningDialog
		{passcode}
		bind:open={$isGuestAuthOpen}
		meetingSlug={$activeMeeting?.slug ?? ''}
		on:guest-sign-in={handleGuestSignIn}
	/>
	<!-- Themed background during SSR -->
	<div class="background" />
</div>

<style lang="postcss">
	.background {
		@apply fixed inset-0 z-[-1] bg-shade-0 transition-colors;
	}
</style>
