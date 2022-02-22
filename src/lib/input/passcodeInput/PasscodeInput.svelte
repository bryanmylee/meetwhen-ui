<script lang="ts">
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { useActions } from '$lib/core/utils/useActions';

	import { tick } from 'svelte';

	export let value = '';
	export let error = '';
	export let maxlength = 6;
	export let disabled = false;

	let inputElement: HTMLInputElement;
	export let use: HTMLActionArray = [];

	const handleKeypress = async () => {
		// simulate insert mode.
		const initStart = inputElement.selectionStart ?? 0;
		value = value.substring(0, initStart) + value.substring(initStart + 1);
		await tick();
		inputElement.selectionEnd = initStart;
	};

	let cursorPosition = 0;
	const handleKeydown = (event: KeyboardEvent) => {
		handleBackspace(event);
		handleCursor();
	};

	const handleBackspace = async (event: KeyboardEvent) => {
		if (event.key !== 'Backspace') {
			return;
		}
		if (inputElement.selectionStart !== inputElement.selectionEnd) {
			return;
		}
		// ignore backspace if no char under cursor.
		if (cursorPosition >= value.length) {
			return;
		}
		event.preventDefault();
		const initStart = inputElement.selectionStart ?? 0;
		value = value.slice(0, cursorPosition) + value.slice(cursorPosition + 1);
		await tick();
		inputElement.selectionEnd = initStart;
	};

	const handleCursor = () => {
		setTimeout(() => {
			cursorPosition = Math.min(
				maxlength - 1,
				inputElement.selectionStart ?? 0,
			);
		}, 17);
	};

	let className = '';
	export { className as class };

	export let classLetterbox = '';
</script>

<div
	class="passcode-box"
	class:error={error !== ''}
	style:--max-length={maxlength}
>
	<input
		type="text"
		bind:this={inputElement}
		bind:value
		{disabled}
		on:keypress={handleKeypress}
		on:keydown={handleKeydown}
		on:mousedown={handleCursor}
		{maxlength}
		spellcheck="false"
		class="passcode-input {className}"
		use:useActions={use}
	/>
	{#each { length: maxlength } as _, index}
		<div
			class="passcode-letterbox {classLetterbox}"
			class:focused={cursorPosition === index}
		/>
	{/each}
</div>

<style lang="postcss">
	.passcode-box {
		@apply relative flex justify-center gap-2;
		@apply w-fit h-10;
	}

	.passcode-input {
		@apply absolute inset-0;
		@apply bg-transparent focus:outline-none caret-transparent;
		@apply font-mono font-semibold text-3xl uppercase;
		width: calc(var(--max-length) * (1ch + 1.375rem) + 0.5rem);
		letter-spacing: 1.375rem;
		margin-left: 0.375rem;
		margin-right: -1.375rem;
	}

	.passcode-letterbox {
		@apply font-mono text-3xl w-8 h-10 bg-shade-100 rounded;
		.passcode-box:focus-within &.focused {
			@apply ring ring-primary-400;
		}
		.passcode-box.error & {
			@apply ring ring-red-400;
		}
	}
</style>
