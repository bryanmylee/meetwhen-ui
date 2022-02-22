<script lang="ts">
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { useActions } from '$lib/core/utils/useActions';
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
	export let spellcheck = true;

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
		{spellcheck}
		class:required
		class:filled={value !== ''}
		class:error={error !== ''}
		class:left-empty={leftEmpty}
		on:blur={() => (leftEmpty = true)}
	/>
	<label for={resolvedId} class:required-dot={required}>
		{label}
	</label>
	<span id={errorId} class="error-message" for={resolvedId} role="status">
		{error}
	</span>
</div>

<style lang="postcss">
	.textfield {
		@apply relative inline-block;

		& > input[type='text'],
		& > input[type='password'] {
			@apply relative w-full px-4 pt-5 pb-3 rounded-xl focus;
			@apply bg-shade-100;
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
					&::before {
						content: 'Required';
						@apply absolute top-1.5 right-0 text-xs text-neutral-400;
					}
				}
			}
		}

		& > label {
			@apply absolute inset-0 bottom-auto m-4;
			@apply overflow-hidden whitespace-nowrap text-ellipsis;
			@apply pointer-events-none transition-transform origin-top-left;
			@apply font-medium;
		}

		& > .error-message {
			@apply absolute bottom-0.5 left-0 mx-4 text-red-400 text-xs italic;
			@apply select-none pointer-events-none;
		}
	}
</style>
