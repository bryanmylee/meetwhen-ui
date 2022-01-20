<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = ({ session }) => {
		if (session.user === undefined) {
			return {
				status: 302,
				redirect: '/profile/login',
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { session } from '$lib/stores';
	import type { Session } from '$lib/core/types/Session';
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>On protected route as {$session.user?.email}</h1>
</div>
