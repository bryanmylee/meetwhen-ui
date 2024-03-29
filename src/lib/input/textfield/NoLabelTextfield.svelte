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

	export let password = false;
	export let required = false;
	export let disabled = false;

	export let use: HTMLActionArray = [];

	$: attrs = {
		type: password ? 'password' : 'text',
	};

	let className = '';
	export { className as class };

	let leftEmpty = false;
	$: if (leftEmpty && value) {
		leftEmpty = false;
	}

	export let sm = false;
</script>

<div class="textfield {className}">
	<input
		use:useActions={use}
		id={resolvedId}
		aria-describedby={errorId}
		bind:value
		{...attrs}
		{required}
		{disabled}
		class:required
		class:filled={value !== ''}
		class:error={error !== ''}
		class:left-empty={leftEmpty}
		class:sm
		on:blur={() => (leftEmpty = true)}
	/>
	<label for={resolvedId}>
		{label}
		{#if required}
			<span class="required-dot" aria-label="required">•</span>
		{/if}
	</label>
	<span
		class:sm
		id={errorId}
		class="error-message"
		for={resolvedId}
		role="status"
	>
		{error}
	</span>
</div>

<style lang="postcss">
	.textfield {
		@apply relative inline-block;

		& > input[type='text'],
		& > input[type='password'] {
			@apply relative w-full p-4 rounded-xl focus;
			@apply bg-shade-100;
			&.sm {
				@apply py-2;
			}

			&:disabled {
				@apply text-neutral-400 opacity-50;
				& + label {
					@apply text-neutral-400 opacity-50;
				}
			}

			&:focus,
			&.filled {
				& + label {
					@apply -translate-y-3 scale-75 text-primary-400;
				}
			}

			&.error,
			&.required.left-empty {
				@apply ring ring-red-400;
				& + label {
					@apply text-red-400;
				}
			}

			&.required:not(.filled):not(:focus) {
				& + label {
					&::after {
						content: 'Required';
						@apply absolute top-1.5 right-0 text-xs text-neutral-400;
					}
				}
			}
		}

		& > label {
			@apply sr-only;
		}

		& > .error-message {
			@apply absolute bottom-0.5 left-0 mx-4 text-red-400 text-xs italic;
			@apply select-none pointer-events-none;
			&.sm {
				@apply bottom-0;
			}
		}
	}
</style>
