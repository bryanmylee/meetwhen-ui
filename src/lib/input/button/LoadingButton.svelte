<script lang="ts">
	import Button from './Button.svelte';
	import { getLoading } from '$lib/loading';
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { classes } from '$lib/core/utils/classes';
	import Spinner from '$lib/core/components/Spinner.svelte';

	export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
	export let disabled = false;
	export let variant: 'filled' | 'outlined' | 'text-only' = 'filled';
	export let color: 'primary' | 'gray' | 'gradient' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'lg';
	export let icon = false;
	export let href: Maybe<string> = undefined;

	export let use: HTMLActionArray = [];

	let className = '';
	export { className as class };

	const isLoading = getLoading();
</script>

<div class="contents" class:loading={$isLoading}>
	<Button
		{type}
		disabled={disabled || $isLoading}
		{variant}
		{color}
		{size}
		{icon}
		{href}
		{use}
		class={classes(className, 'loading')}
		on:blur
		on:click
		on:contextmenu
		on:dblclick
		on:focus
	>
		<slot />
		{#if $isLoading}
			<div class="spinner">
				<Spinner />
			</div>
		{/if}
	</Button>
</div>

<style lang="postcss">
	.loading > :global(button) {
		animation: ring-breathe 2s ease-in-out infinite both;
		@apply relative;
	}

	.spinner {
		@apply absolute inset-0 z-10 pointer-events-none;
		@apply flex justify-center items-center;
	}
</style>
