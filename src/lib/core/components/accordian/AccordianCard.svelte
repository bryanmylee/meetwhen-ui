<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils/classes';

	let className = '';
	export { className as class };

	export let open = false;
</script>

<div class="accordian-card {className}">
	<button
		on:click={() => (open = !open)}
		class="accordian-title"
		aria-expanded={open}
	>
		<slot name="title">
			<div />
		</slot>
		<ChevronDownIcon
			class={classes('wh-6 transition-transform', open && 'rotate-180')}
		/>
	</button>
	{#if open}
		<div
			transition:slide|local={{ duration: 300, easing: cubicOut }}
			class="accordian-panel"
		>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss" global>
	.accordian-card {
		@apply card rounded-xl;
		& .accordian-title {
			@apply p-4 rounded-xl focus-inset;
		}
		& .accordian-panel {
			@apply p-4 pt-1;
		}
	}

	.accordian-title {
		@apply w-full;
		@apply flex items-center gap-4;
		@apply text-left;
	}

	.accordian-panel {
		@apply w-full;
	}
</style>
