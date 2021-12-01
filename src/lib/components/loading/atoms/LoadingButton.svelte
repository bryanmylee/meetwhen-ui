<script lang="ts" context="module">
	export type ButtonType = 'button' | 'submit';
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { classes } from '$lib/utils/classes';
	import { getLoadingContext } from './index';

	export let isPrimary = false;
	export let type: ButtonType = 'button';
	export let disabled = false;
	export let ariaLabel: string = undefined;
	export let tabindex: number = undefined;

	const isLoading = getLoadingContext();

	let attrs = {};
	$: {
		attrs = {
			type,
			disabled: $isLoading || disabled,
		};
		if (ariaLabel !== undefined) {
			attrs['aria-label'] = ariaLabel;
		}
		if (tabindex !== undefined) {
			attrs['tabindex'] = tabindex;
		}
	}

	let className = '';
	export { className as class };
	$: buttonClass = classes([
		className,
		'relative min-w-28',
		$isLoading && isPrimary && 'bg-gradient-primary bg-animate-fast opacity-50',
	]);
</script>

<button {...attrs} on:click class={buttonClass}>
	{#if $isLoading && isPrimary}
		<div class="loading" in:fly={{ y: 20 }}>Loading...</div>
		&nbsp;
	{:else}
		<slot />
	{/if}
</button>

<style lang="postcss">
	div.loading {
		@apply flex justify-center items-center absolute inset-0 rounded-full ring-primary text-primary-text;
		animation: ring-breathe 1.4s ease-in-out infinite both;
	}
	@keyframes ring-breathe {
		0% {
			box-shadow: 0 0 0 0px var(--tw-ring-color);
		}
		50% {
			box-shadow: 0 0 0 3px var(--tw-ring-color);
		}
		100% {
			box-shadow: 0 0 0 0px var(--tw-ring-color);
		}
	}
</style>
