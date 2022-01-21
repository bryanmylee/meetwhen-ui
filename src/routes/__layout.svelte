<script lang="ts" context="module">
	export const load: Load = async () => {
		if (!browser) {
			const { serviceKey } = getServerEnv();
			initFirebaseAdmin(serviceKey);
		}
		const { firebaseConfig } = getClientEnv();
		initFirebaseClient(firebaseConfig);
		return {};
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
	import Nav from '$lib/core/components/nav/Nav.svelte';
	import AuthDialog from '$lib/auth/components/AuthDialog.svelte';

	setFirebaseApp(firebaseClient.app);
	setFirebaseAuth(firebaseClient.auth);
	setRepo(firebaseClient.repo);

	const user = configureUser(firebaseClient.auth, $session);
	setUser(user);
</script>

<div style={$primaryVars}>
	<Nav user={$user} on:open-auth={() => ($isAuthOpen = true)} />
	<main>
		<slot />
	</main>
	<AuthDialog open={$isAuthOpen} />
</div>
