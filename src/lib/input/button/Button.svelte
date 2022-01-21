<script lang="ts">
	import type { Maybe } from '$lib/core/types/Maybe';

	export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
	export let disabled = false;
	export let variant: 'filled' | 'outlined' | 'text-only' = 'filled';
	export let color: 'primary' | 'gray' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'lg';
	export let icon = false;
	export let href: Maybe<string> = undefined;

	let className = '';
	export { className as class };
</script>

{#if href !== undefined}
	<a
		{href}
		{...$$restProps}
		{type}
		{disabled}
		on:click
		on:dblclick
		on:contextmenu
		on:focus
		on:blur
		class="button {className}"
		class:filled={variant === 'filled'}
		class:outlined={variant === 'outlined'}
		class:textOnly={variant === 'text-only'}
		class:primary={color === 'primary'}
		class:gray={color === 'gray'}
		class:sm={size === 'sm'}
		class:md={size === 'md'}
		class:icon
	>
		<slot />
	</a>
{:else}
	<button
		{...$$restProps}
		{type}
		{disabled}
		on:click
		on:dblclick
		on:contextmenu
		on:focus
		on:blur
		class="button {className}"
		class:filled={variant === 'filled'}
		class:outlined={variant === 'outlined'}
		class:textOnly={variant === 'text-only'}
		class:primary={color === 'primary'}
		class:gray={color === 'gray'}
		class:sm={size === 'sm'}
		class:md={size === 'md'}
		class:icon
	>
		<slot />
	</button>
{/if}

<style lang="postcss">
	.button {
		@apply p-4 rounded-full font-bold focus;
		@apply ring-offset-2 ring-offset-white gdark:ring-offset-neutral-800;
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

		&.sm {
			@apply py-2;
		}

		&.md {
			@apply py-3;
		}

		&.icon {
			@apply p-1;
		}
	}
</style>
