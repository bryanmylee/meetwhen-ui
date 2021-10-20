<script lang="ts">
	import type { ShallowUser } from '$lib/gql/types';
	import ChipList from './ChipList.svelte';

	export let users: ShallowUser[] = [];
</script>

<h2 class="text-sm font-bold">
	{users.length} unavailable
</h2>
<ChipList chips={users.map((u) => u.name)} class="mt-2" />
