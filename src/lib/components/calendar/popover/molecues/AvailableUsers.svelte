<script lang="ts">
	import ChipList from './ChipList.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import type { ShallowUser } from '$lib/gql/types';
	import { getContext } from 'svelte';

	export let users: ShallowUser[] = [];
	const state = getContext<CalendarState>('state');
	const { allUsers } = state;

	const getMaxHeaderLabel = (count: number) => {
		switch (count) {
			case 2:
				return 'Both available!';
			default:
				return `All ${count} available!`;
		}
	};

	$: hasMaxUsers = users.length === $allUsers.length;
	$: headerLabel = hasMaxUsers ? getMaxHeaderLabel(users.length) : `${users.length} available`;
</script>

{#if users.length > 1}
	<h2 class="mb-2 text-sm font-bold">
		{headerLabel}
	</h2>
{/if}
<ChipList chips={users.map((u) => u.name)} isActive />
