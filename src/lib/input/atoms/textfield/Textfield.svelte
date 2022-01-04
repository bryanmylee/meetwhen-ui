<script lang="ts">
	import { getIdFromLabel } from '$lib/input/utils/getIdFromLabel';
	import type { Maybe } from '$lib/core/types/Maybe';

	export let label = '';
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
</script>

<div class={className}>
	<input
		bind:value
		{...attrs}
		{required}
		{disabled}
		class="focus"
		class:filled={value !== ''}
		class:error={error !== ''}
	/>
	<label for={resolvedId}>{label}</label>
	{#if error !== ''}
		<span for={resolvedId}>{error}</span>
	{/if}
</div>

<style lang="postcss">
	div {
		@apply relative inline-block;

		& > input[type='text'],
		& > input[type='password'] {
			@apply relative w-full px-4 pt-5 pb-3 rounded-xl;
			@apply bg-gray-100 dark:bg-gray-700 dark:text-white;
			&:disabled {
				@apply text-gray-400 ring ring-inset ring-gray-100 dark:ring-gray-700;
				@apply bg-gray-200 dark:bg-gray-600;
				& + label {
					@apply !text-gray-400;
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

		& > span {
			@apply absolute bottom-0.5 left-0 mx-4 text-red-400 transform text-xs italic;
		}
	}
</style>
