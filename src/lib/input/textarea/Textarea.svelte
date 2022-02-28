<script lang="ts">
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { useActions } from '$lib/core/actions';
	import { getIdFromLabel } from '$lib/input/utils/getIdFromLabel';

	export let label: string;
	export let id: Maybe<string> = undefined;
	$: resolvedId = id ?? getIdFromLabel(label);
	$: errorId = `${resolvedId}-error`;

	export let value = '';
	export let error = '';

	export let required = false;
	export let disabled = false;

	export let use: HTMLActionArray = [];

	let className = '';
	export { className as class };

	let leftEmpty = false;
	$: if (leftEmpty && value) {
		leftEmpty = false;
	}
</script>

<div class="textarea {className}">
	<textarea
		use:useActions={use}
		id={resolvedId}
		aria-describedby={errorId}
		bind:value
		{required}
		{disabled}
		class:required
		class:filled={value !== ''}
		class:error={error !== ''}
		class:left-empty={leftEmpty}
		on:blur={() => (leftEmpty = true)}
	/>
	<label for={resolvedId}>
		{label}
		{#if required}
			<span class="required-dot" aria-label="required">•</span>
		{/if}
	</label>
	<span id={errorId} class="error-message" for={resolvedId} role="status">
		{error}
	</span>
</div>

<style lang="postcss">
	.textarea {
		@apply relative inline-block;

		& > textarea {
			@apply relative w-full -mb-1 px-4 py-5 rounded-xl focus;
			@apply bg-shade-100;
			&:disabled {
				@apply text-neutral-400 opacity-50;
				& + label {
					@apply text-neutral-400 opacity-50 bg-transparent;
				}
			}

			&:focus,
			&.filled {
				& + label {
					@apply -translate-y-2 scale-75 text-primary-400;
				}
			}

			&.error,
			&.required.left-empty {
				@apply ring ring-red-400;
				& + label {
					@apply text-red-400;
				}
			}
		}

		& > label {
			@apply absolute inset-0 bottom-auto mt-2.5 ml-2.5 px-2 pt-0.5 max-w-fit;
			@apply overflow-hidden whitespace-nowrap text-ellipsis;
			@apply pointer-events-none transition-transform origin-top-left;
			@apply bg-shade-100 rounded-b-lg;
			@apply font-medium;

			& > .required-dot {
				@apply text-red-400 font-bold;
			}
		}

		& > .error-message {
			@apply absolute bottom-1.5 left-2.5 px-1.5 pb-1 text-red-400 text-xs italic;
			@apply select-none pointer-events-none;
			@apply bg-shade-100 rounded-t-lg;
		}
	}
</style>
