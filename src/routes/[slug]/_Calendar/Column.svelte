<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import Available from './Available.svelte';
	import { getContext } from 'svelte';
	import type { CalendarState } from './state/core';

	const state = getContext<CalendarState>('state');
	const { availables } = state;

	export let day: Dayjs;
</script>

{#each $availables as available}
	<Available {day} {available} />
{/each}
