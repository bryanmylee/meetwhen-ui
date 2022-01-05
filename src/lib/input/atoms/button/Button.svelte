<script lang="ts">
	export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
	export let disabled = false;
	export let variant: 'filled' | 'outlined' = 'filled';
	export let color: 'primary' | 'gray' = 'primary';

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
	class:filled={variant === 'filled'}
	class:outlined={variant === 'outlined'}
	class:primary={color === 'primary'}
	class:gray={color === 'gray'}
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

		&.filled {
			&.primary {
				@apply bg-primary-400 text-white;
			}
			&.gray {
				@apply bg-neutral-100 text-black;
				@apply dark:bg-neutral-700 dark:text-white;
			}

			&:disabled {
				@apply opacity-50;
				&.gray {
					@apply text-neutral-400;
				}
			}

			&:not(:disabled) {
				&:not(:active):hover {
					&.primary {
						@apply bg-primary-300 shadow-sm shadow-primary-300;
					}
					&.gray {
						@apply bg-neutral-50 dark:bg-neutral-600 shadow;
					}
				}
				&:active {
					&.primary {
						@apply bg-primary-500 shadow shadow-primary-300;
					}
					&.gray {
						@apply bg-neutral-200 dark:bg-neutral-500 shadow-sm;
					}
				}
			}
		}

		&.outlined {
			@apply p-3.5 border-2;
			&.primary {
				@apply border-primary-400 text-primary-400;
			}
			&.gray {
				@apply border-neutral-500 text-neutral-500;
				@apply dark:border-neutral-300 dark:text-neutral-300;
			}

			&:disabled {
				@apply opacity-50;
				&.gray {
					@apply border-neutral-400 text-neutral-400;
				}
			}

			&:not(:disabled) {
				&:not(:active):hover {
					&.primary {
						@apply text-primary-300 border-primary-300 shadow-sm shadow-primary-300;
					}
					&.gray {
						@apply border-neutral-400 text-neutral-400 shadow;
					}
				}
				&:active {
					&.primary {
						@apply text-primary-500 border-primary-500 shadow shadow-primary-300;
					}
					&.gray {
						@apply border-neutral-500 text-neutral-500;
					}
				}
			}
		}
	}
</style>
