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
	import type { Load } from '@sveltejs/kit';
	import { session } from '$lib/stores';
	import type { Session } from '$lib/core/types/Session';
	import type { SafeUser } from '$lib/core/types/SafeUser';
	import { useLiveDocument } from '$lib/firebase/useLiveDocument';

	export let currentUser: SafeUser;
	$: console.log(currentUser.uid);

	const meetingIdDoc = useLiveDocument('user-meeting', currentUser.uid);
	$: meetingIds = $meetingIdDoc?.data();
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {$session.user?.email}</h1>
	{JSON.stringify(meetingIds)}
</div>
