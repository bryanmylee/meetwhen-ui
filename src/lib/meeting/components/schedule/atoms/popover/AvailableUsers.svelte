<script lang="ts">
	import type { UserData } from '$lib/models/UserData';
	import UserPreview from './UserPreview.svelte';

	export let users: UserData[];

	const getMaxHeaderLabel = (count: number) => {
		if (count === 2) {
			return 'Both available!';
		}
		return `All ${count} available!`;
	};

	$: hasMaxUsers = users.length === 1;
	$: headerLabel = hasMaxUsers
		? getMaxHeaderLabel(users.length)
		: `${users.length} available`;
</script>

<div>
	{#if users.length > 1}
		<h2 class="mb-2 text-sm font-bold">
			{headerLabel}
		</h2>
	{/if}
	<ul class="flex flex-wrap gap-2">
		{#each users as user}
			<li>
				<UserPreview
					displayName={user.displayName}
					email={user.email}
					photoURL={user.photoURL}
				/>
			</li>
		{/each}
	</ul>
</div>
