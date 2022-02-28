<script lang="ts">
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import PasscodeInput from './PasscodeInput.svelte';
	import { getLoading } from '$lib/loading';

	export let value = '';
	export let error = '';
	export let maxlength = 6;
	export let disabled = false;

	export let use: HTMLActionArray = [];

	const isLoading = getLoading();

	let className = '';
	export { className as class };

	export let classLetterbox = '';
</script>

<div class="w-fit rounded" class:loading={$isLoading}>
	<PasscodeInput
		bind:value
		bind:error
		disabled={disabled || $isLoading}
		{maxlength}
		{use}
		class="{className} passcode-input"
		{classLetterbox}
	/>
</div>

<style lang="postcss">
	.loading {
		@apply animate-pulse;
	}

	.loading :global(.passcode-input) {
		@apply text-neutral-400;
	}
</style>
