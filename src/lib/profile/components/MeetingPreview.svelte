<script lang="ts">
	import { getColorCssVars, getColorScheme, PRIMARY_HEX } from '$lib/colors';

	import type { Maybe } from '$lib/core/types/Maybe';

	export let name: string;
	export let slug: string;
	export let color: Maybe<string> = undefined;
	export let isLoading = false;
</script>

{#if isLoading}
	<div class="preview-item-box">
		<p class="preview-item skeleton">
			{name}
		</p>
	</div>
{:else}
	<div class="preview-item-box">
		<span class="preview-item-color" />
		<a
			href="/{slug}"
			class="preview-item"
			style="{getColorCssVars(
				'primary',
				getColorScheme(color ?? PRIMARY_HEX),
			)};"
		>
			<p>{name}</p>
		</a>
	</div>
{/if}

<style lang="postcss">
	.preview-item-box {
		@apply relative overflow-hidden flex-1;
		@apply rounded-lg bg-neutral-100 gdark:bg-neutral-700 focus-within;
		@apply transition;
		&:hover {
			@apply bg-neutral-50 gdark:bg-neutral-600 shadow;
		}
		&:active {
			@apply bg-neutral-200 gdark:opacity-50 shadow-sm;
		}
	}

	.preview-item-color {
		@apply block absolute left-0 top-0 bottom-0 w-2;
		@apply overflow-hidden text-ellipsis;
		@apply bg-primary-400;
	}

	.preview-item {
		&.skeleton {
			@apply skeleton-bg;
		}
		@apply block p-2 ml-2 text-sm font-medium;
	}
</style>
