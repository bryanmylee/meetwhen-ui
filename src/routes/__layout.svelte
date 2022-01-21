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
	import { primaryVars } from '$lib/core/state';
	import {
		initFirebaseClient,
		setFirebaseApp,
		setFirebaseAuth,
		setRepo,
		setUser,
	} from '$lib/firebase';
	import { initFirebaseAdmin } from '$lib/firebase/server';
	import { configureUser } from '$lib/auth/configureUser';
	import { firebaseClient } from '$lib/firebase';

	setFirebaseApp(firebaseClient.app);
	setFirebaseAuth(firebaseClient.auth);
	setRepo(firebaseClient.repo);

	const user = configureUser(firebaseClient.auth, $session);
	setUser(user);
</script>

<div style={$primaryVars}>
	<slot />
</div>
