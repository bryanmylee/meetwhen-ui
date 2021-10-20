<script lang="ts">
	import type { ShallowUser } from '$lib/gql/types';
	import { getContext } from 'svelte';
	import type { CalendarState } from '../state/core';
	import ChipList from './ChipList.svelte';

	export let users: ShallowUser[] = [];
	const state = getContext<CalendarState>('state');
	const { allUsers } = state;

	$: hasMaxUsers = users.length === $allUsers.length;
	$: headerLabel = hasMaxUsers ? `All ${users.length} available!` : `${users.length} available`;
</script>

<h2 class="text-sm font-bold">
	{headerLabel}
</h2>
<ChipList chips={users.map((u) => u.name)} class="mt-2" isActive />
