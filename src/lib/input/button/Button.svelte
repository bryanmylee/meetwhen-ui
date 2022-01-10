<script lang="ts">
	export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
	export let disabled = false;
	export let variant: 'filled' | 'outlined' | 'text-only' = 'filled';
	export let color: 'primary' | 'gray' = 'primary';

	let className = '';
	export { className as class };
</script>

<button
	{...$$props}
	{type}
	role="button"
	{disabled}
	on:click
	on:dblclick
	on:contextmenu
	on:focus
	on:blur
	class="button focus {className}"
	class:filled={variant === 'filled'}
	class:outlined={variant === 'outlined'}
	class:textOnly={variant === 'text-only'}
	class:primary={color === 'primary'}
	class:gray={color === 'gray'}
>
	<slot />
</button>

<style lang="postcss">
	.button {
		@apply p-4 rounded-full font-bold;
		@apply ring-offset-2 ring-offset-white gdark:ring-offset-neutral-700;
		@apply transition-colors;

		&:disabled {
			@apply text-neutral-400 opacity-50;
		}

		&.filled {
			&.primary {
				@apply bg-primary-400 text-white;
			}
			&.gray {
				@apply bg-shade-100;
			}

			&:not(:disabled) {
				&:not(:active):hover {
					&.primary {
						@apply bg-primary-300 shadow-sm shadow-primary-300;
					}
					&.gray {
						@apply bg-shade-50 shadow;
					}
				}
				&:active {
					&.primary {
						@apply bg-primary-500 shadow shadow-primary-300;
					}
					&.gray {
						@apply bg-shade-200 shadow-sm;
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
				@apply gdark:border-neutral-300 gdark:text-neutral-300;
			}

			&:disabled {
				&.gray {
					@apply border-neutral-300 text-neutral-300;
					@apply gdark:border-neutral-500 text-neutral-500;
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

		&.textOnly {
			&:not(:disabled) {
				&:not(:active):hover {
					@apply text-neutral-500 gdark:text-neutral-300;
				}
				&:active {
					@apply text-neutral-600 gdark:text-neutral-400;
				}
			}
		}
	}
</style>
