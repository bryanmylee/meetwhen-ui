<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = ({ session }) => {
		if (session.user === undefined) {
			return {
				status: 302,
				redirect: '/profile/login',
			};
		}
		return {
			props: {
				currentUser: session.user,
			},
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Load } from '@sveltejs/kit';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { session } from '$lib/stores';
	import type { Session } from '$lib/core/types/Session';
	import { getRepo } from '$lib/firebase';
	import type { SafeUser } from '$lib/core/types/SafeUser';

	export let currentUser: SafeUser;
	$: console.log(currentUser.uid);

	const repo = getRepo();

	onMount(() => {
		return onSnapshot(
			doc(repo, 'user-meeting', currentUser.uid),
			(document) => {
				console.log(document.data());
			},
		);
	});
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {$session.user?.email}</h1>
</div>
