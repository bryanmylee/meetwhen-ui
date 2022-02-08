<script lang="ts" context="module">
	export const load: Load = async ({ session }) => {
		if (!browser) {
			const { serviceKey } = getServerEnv();
			initFirebaseAdmin(serviceKey);
		}
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
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getClientEnv, getServerEnv } from '$lib/env';
	import { session } from '$lib/stores';
	import {
		isAuthOpen,
		primaryVars,
		setIsDark,
		setTheme,
	} from '$lib/core/state';
	import { initFirebaseClient } from '$lib/firebase/client';
	import {
		setFirebaseApp,
		setFirebaseAuth,
		setRepo,
		setUser,
	} from '$lib/firebase/context';
	import { initFirebaseAdmin } from '$lib/firebase/server';
	import { configureUser } from '$lib/auth/configureUser';
	import { firebaseClient } from '$lib/firebase/client';
	import type { ThemeType } from '$lib/core/types/ThemeType';
	import { useCookie } from '$lib/core/utils/cookies/useCookie';
	import { Nav } from '$lib/core/components/nav';
	import { AuthDialog } from '$lib/auth/components/authDialog';
	import type { AuthDialogEvent } from '$lib/auth/components/authDialog';
	import { useDarkMode } from '$lib/colors/utils/useDarkMode';
	import { oAuthSignIn, passwordSignIn } from '$lib/auth/utils/handleSignIn';
	import { useScreenHeight } from '$lib/core/utils/useScreenHeight';

	export let initTheme: ThemeType;
	const theme = useCookie('theme', initTheme);
	setTheme(theme);
	const isDark = useDarkMode(theme);
	setIsDark(isDark);
	const screenHeight = useScreenHeight();
	// $: vh = $screenHeight === undefined ? '' : `--vh:${$screenHeight}px;`;

	setFirebaseApp(firebaseClient.app);
	setFirebaseAuth(firebaseClient.auth);
	setRepo(firebaseClient.repo);

	const user = configureUser(firebaseClient.auth, $session);
	setUser(user);
	$: currentUser = $user?.ssr ? undefined : $user;

	const handlePasswordSignIn = async ({
		detail,
	}: CustomEvent<AuthDialogEvent['password-signin']>) => {
		await passwordSignIn(firebaseClient.auth, {
			currentUser,
			email: detail.email,
			password: detail.password,
		});
		onSignIn();
	};

	const handleOAuthSignIn = async ({
		detail,
	}: CustomEvent<AuthDialogEvent['oauth-signin']>) => {
		await oAuthSignIn(firebaseClient.auth, {
			currentUser,
			providerType: detail.providerType,
		});
		onSignIn();
	};

	const onSignIn = () => {
		$isAuthOpen = false;
		if ($page.url.pathname === '/') {
			goto('/profile');
		}
	};

	$: onHomePage = $page.url.pathname === '/';
</script>

<!-- ; forces string interpolation during SSR and prevents incorrect rendering of escape sequences -->
<div id="root" style="{$primaryVars};" class:dark={$isDark}>
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
		bind:open={$isAuthOpen}
		on:password-signin={handlePasswordSignIn}
		on:oauth-signin={handleOAuthSignIn}
	/>
	<!-- Themed background during SSR -->
	<div class="background" />
</div>

<style lang="postcss">
	.background {
		@apply fixed inset-0 z-[-1] bg-shade-0 transition-colors;
	}
</style>
