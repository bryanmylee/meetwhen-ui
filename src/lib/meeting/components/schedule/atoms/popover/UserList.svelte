<script lang="ts">
	import type { UserData } from '$lib/models/UserData';
	import UserPreview from './UserPreview.svelte';

	export let users: UserData[];

	export let unavailable = false;
	$: tag = unavailable ? 'unavailable' : 'available';

	export let maxUserCount: number;

	const getMaxHeaderLabel = (count: number) => {
		if (count === 2) {
			return `Both ${tag}!`;
		}
		return `All ${count} ${tag}!`;
	};

	$: hasMaxUsers = users.length === maxUserCount;
	$: headerLabel = hasMaxUsers
		? getMaxHeaderLabel(users.length)
		: `${users.length} ${tag}`;
</script>

<div>
	{#if users.length > 1 || unavailable}
		<h2 class="mb-2 text-sm font-semibold">
			{headerLabel}
		</h2>
	{/if}
	<ul class="flex flex-wrap gap-2">
		{#each users as user}
			<li>
				<UserPreview
					{unavailable}
					displayName={user.displayName}
					email={user.email}
					photoURL={user.photoURL}
				/>
			</li>
		{/each}
	</ul>
</div>
