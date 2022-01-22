<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = async ({ session }) => {
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
	import { getClientEnv, getServerEnv } from '$lib/env';
	import { session } from '$lib/stores';
	import { isAuthOpen, primaryVars } from '$lib/core/state';
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
	import type { Session } from '$lib/core/types/Session';
	import type { ThemeType } from '$lib/core/types/ThemeType';
	import { useCookie } from '$lib/core/utils/cookies/useCookie';
	import Nav from '$lib/core/components/nav/Nav.svelte';
	import AuthDialog from '$lib/auth/components/AuthDialog.svelte';

	export let initTheme: ThemeType;
	const theme = useCookie('theme', initTheme);
	$: console.log($theme);

	setFirebaseApp(firebaseClient.app);
	setFirebaseAuth(firebaseClient.auth);
	setRepo(firebaseClient.repo);

	const user = configureUser(firebaseClient.auth, $session);
	setUser(user);
</script>

<div style={$primaryVars}>
	<Nav
		user={$user}
		theme={$theme}
		on:open-auth={() => ($isAuthOpen = true)}
		on:select-theme={(e) => ($theme = e.detail.theme)}
	/>
	<main>
		<slot />
	</main>
	<AuthDialog open={$isAuthOpen} />
</div>
