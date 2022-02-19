<script lang="ts">
	import { tick } from 'svelte';

	export let value = '';
	export let maxlength = 6;

	let inputElement: HTMLInputElement;

	const handleKeydown = async (event: KeyboardEvent) => {
		await handleBackspace(event);
		handleCursor(event);
		await checkCursorPosition();
	};

	const handleBackspace = async (event: KeyboardEvent) => {
		if (event.key !== 'Backspace') {
			return;
		}
		if (inputElement.selectionStart !== inputElement.selectionEnd) {
			return;
		}
		event.preventDefault();
		value = value.slice(0, cursorPosition) + value.slice(cursorPosition + 1);
		await tick();
		if (cursorPosition >= value.length) {
			cursorPosition--;
		}
		inputElement.selectionStart = cursorPosition;
		inputElement.selectionEnd = cursorPosition;
	};

	let cursorPosition = 0;
	const handleCursor = (event: Event) => {
		const inputTarget = event.target as HTMLInputElement;
		cursorPosition = Math.min(maxlength - 1, inputTarget.selectionStart ?? 0);
	};

	const checkCursorPosition = async () => {
		await tick();
		if (cursorPosition >= maxlength) {
			cursorPosition = maxlength - 1;
			inputElement.selectionStart = cursorPosition;
			inputElement.selectionEnd = cursorPosition;
		}
	};
</script>

<div class="passcode-box" style:--max-length={maxlength}>
	<input
		type="text"
		bind:this={inputElement}
		bind:value
		on:click={handleCursor}
		on:keyup={handleCursor}
		on:keydown={handleKeydown}
		{maxlength}
		spellcheck="false"
		class="passcode-input"
	/>
	{#each { length: maxlength } as _, index}
		<div class="passcode-letterbox" class:focused={cursorPosition === index} />
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
	}
</style>
