<script lang="ts" context="module">
	export interface AccordianEvent {
		toggle: {
			expanded: boolean;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ReactiveClass } from '$lib/typings/reactive-class';

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

	export let xclass: ReactiveClass<{ expanded: boolean }> = () => '';
	export let xtitleclass: ReactiveClass<{ expanded: boolean }> = () => '';
</script>

<div class={xclass({ expanded })}>
	<div tabindex="0" on:click={toggle} on:keydown={keydown} class={xtitleclass({ expanded })}>
		<slot name="title" />
	</div>
	{#if expanded}
		<slot {expanded} />
	{/if}
</div>
