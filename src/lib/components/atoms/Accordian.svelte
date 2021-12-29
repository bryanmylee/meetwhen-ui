<script lang="ts" context="module">
	export interface AccordianEvent {
		toggle: {
			expanded: boolean;
		};
	}
</script>

<script lang="ts">
	import { classes } from '$lib/utils/classes';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { slide } from 'svelte/transition';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<AccordianEvent>();

	export let expanded = false;

	const toggle = () => {
		expanded = !expanded;
		dispatch('toggle', { expanded });
	};

	const keydown = ({ key }: KeyboardEvent) => {
		if (key === 'Enter' || key === ' ') {
			toggle();
		}
	};
</script>

<div class={classes(expanded && 'card')}>
	<div
		tabindex="0"
		on:click={toggle}
		on:keydown={keydown}
		class="{classes(
			'flex justify-between w-full p-4 card focus:outline-none focus:ring ring-inset ring-primary-lighter',
			expanded && '!shadow-none rounded-b-none'
		)}}"
	>
		<slot name="title" />
		<ChevronDownIcon class="p-2 -m-2 w-10 h-10 transition transform {expanded && 'rotate-180'}" />
	</div>
	{#if expanded}
		<div class="p-4 pt-0" transition:slide|local>
			<slot {expanded} />
		</div>
	{/if}
</div>
