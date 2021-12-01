<script lang="ts">
	import Available from './Available.svelte';
	import type { CalendarState } from '$lib/components/calendar/state/core';
	import type { Dayjs } from 'dayjs';
	import { getContext } from 'svelte';

	const state = getContext<CalendarState>('state');
	const { availables } = state;

	export let day: Dayjs;
</script>

{#each $availables as available}
	<Available {day} {available} />
{/each}
