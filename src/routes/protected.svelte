<script lang="ts" context="module">
	export const load: Load = ({ session }) => {
		const _session = session as Session;
		if (_session.user === undefined) {
			return {
				status: 302,
				redirect: '/',
			};
		}
		return {
			props: {
				session,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/core/types/Session';

	export let session: Session;
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>On protected route as {session.user?.email}</h1>
</div>
