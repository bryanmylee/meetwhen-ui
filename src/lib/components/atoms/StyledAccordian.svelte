<script lang="ts" context="module">
	export interface StyledAccordianEvent {
		toggle: {
			expanded: boolean;
		};
	}
</script>

<script lang="ts">
	import { classes } from '$lib/utils/classes';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { slide } from 'svelte/transition';
	import Accordian from '$lib/components/atoms/Accordian.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<StyledAccordianEvent>();

	export let expanded = false;

	const toggle = () => {
		expanded = !expanded;
		dispatch('toggle', { expanded });
	};
</script>

<Accordian
	xclass={({ expanded }) => expanded && 'card'}
	xtitleclass={({ expanded }) =>
		classes(
			'flex justify-between w-full p-4 card focus:outline-none focus:ring ring-inset ring-primary-lighter',
			expanded && '!shadow-none rounded-b-none'
		)}
	{expanded}
	let:expanded
	on:toggle={toggle}
>
	<svelte:fragment slot="title">
		<slot name="title" />
		<ChevronDownIcon class="p-2 -m-2 w-10 h-10 transition transform {expanded && 'rotate-180'}" />
	</svelte:fragment>
	<div class="p-4 pt-0" transition:slide|local>
		<slot {expanded} />
	</div>
</Accordian>
