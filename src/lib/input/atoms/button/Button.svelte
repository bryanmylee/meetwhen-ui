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
			@apply bg-primary-400 text-white;
			&:disabled {
				@apply opacity-50;
			}
			&:not(:disabled) {
				&:hover {
					@apply bg-primary-300 shadow-sm shadow-primary-300;
				}
				&:active {
					@apply bg-primary-500 shadow shadow-primary-300;
				}
			}
		}

		&.outlined {
			@apply p-3.5 border-2 border-primary-400 text-primary-400;
			&:disabled {
				@apply opacity-50;
			}
			&:not(:disabled) {
				&:hover {
					@apply text-primary-300 border-primary-300 shadow-sm shadow-primary-300;
				}
				&:active {
					@apply text-primary-500 border-primary-500 shadow shadow-primary-300;
				}
			}
		}
	}
</style>
