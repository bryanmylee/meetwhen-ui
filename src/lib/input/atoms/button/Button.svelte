<script lang="ts">
	export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
	export let disabled = false;
	export let variant: 'primary' | 'outlined' = 'primary';

	let className = '';
	export { className as class };
</script>

<button
	{type}
	{disabled}
	on:click
	on:dblclick
	on:contextmenu
	on:focus
	on:blur
	class="button focus {className}"
	class:primary={variant === 'primary'}
	class:outlined={variant === 'outlined'}
>
	<slot />
</button>

<style lang="postcss" global>
	.button {
		@apply p-4 rounded-full font-bold;
		@apply ring-offset-2 ring-offset-white dark:ring-offset-neutral-700;
		@apply transition-colors;

		&:disabled {
			@apply text-neutral-400 cursor-default;
		}

		&.primary {
			@apply bg-blue-400 text-white;
			&:disabled {
				@apply bg-opacity-50;
			}
			&:not(:disabled) {
				&:hover {
					@apply bg-blue-300 shadow-sm shadow-blue-300;
				}
				&:active {
					@apply bg-blue-500 shadow shadow-blue-300;
				}
			}
		}

		&.outlined {
			@apply p-3.5 border-2 border-blue-400 text-blue-400;
			&:disabled {
				@apply text-opacity-50 border-opacity-50;
			}
			&:not(:disabled) {
				&:hover {
					@apply text-blue-300 border-blue-300 shadow-sm shadow-blue-300;
				}
				&:active {
					@apply text-blue-500 border-blue-500 shadow shadow-blue-300;
				}
			}
		}
	}
</style>
