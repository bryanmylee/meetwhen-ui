<script lang="ts">
	import { getIdFromLabel } from '$lib/input/utils/getIdFromLabel';
	import type { Maybe } from '$lib/core/types/Maybe';

	export let label: string;
	export let id: Maybe<string> = undefined;
	$: resolvedId = id ?? getIdFromLabel(label);

	export let value = '';
	export let error = '';

	export let password = false;
	export let required = false;
	export let disabled = false;

	$: attrs = {
		id: resolvedId,
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
		bind:value
		{...attrs}
		{required}
		{disabled}
		class="focus"
		class:filled={value !== ''}
		class:error={error !== '' || (required && leftEmpty)}
		on:blur={() => (leftEmpty = true)}
	/>
	<label for={resolvedId}>{label}</label>
	{#if error !== ''}
		<span class="error-message" for={resolvedId}>{error}</span>
	{/if}
</div>

<style lang="postcss" global>
	.textfield {
		@apply relative inline-block;

		& > input[type='text'],
		& > input[type='password'] {
			@apply relative w-full px-4 pt-5 pb-3 rounded-xl;
			@apply bg-neutral-100 dark:bg-neutral-700 dark:text-white;
			&:disabled {
				@apply text-neutral-400;
				@apply bg-neutral-200 dark:bg-neutral-600;
				& + label {
					@apply !text-neutral-400;
				}
			}

			&:focus,
			&.filled {
				& + label {
					@apply transform -translate-y-3 scale-75 text-blue-400;
				}
			}

			&.error {
				@apply ring ring-red-400;
				& + label {
					@apply !text-red-400;
				}
			}
		}

		& > label {
			@apply absolute -top-3 left-0 mx-4 mt-7 mb-5 dark:text-white;
			@apply pointer-events-none transition-transform origin-top-left;
		}

		& > .error-message {
			@apply absolute bottom-0.5 left-0 mx-4 text-red-400 transform text-xs italic select-none;
		}
	}
</style>
