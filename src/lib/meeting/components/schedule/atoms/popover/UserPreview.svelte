<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createPopperActions } from 'svelte-popperjs';
	import { focus } from '$lib/core/utils/useFocus';
	import { hover } from '$lib/core/utils/useHover';
	import type { Maybe } from '$lib/core/types/Maybe';

	const [ref, content] = createPopperActions({
		strategy: 'absolute',
		placement: 'bottom',
		modifiers: [{ name: 'flip' }],
	});

	export let displayName: Maybe<string>;
	export let email: Maybe<string>;
	export let photoURL: Maybe<string>;

	const isHovering = writable(false);
	const isFocusing = writable(false);

	let imageElement: Maybe<HTMLImageElement>;
	const handleImageError = () => {
		if (imageElement === undefined) {
			return;
		}
		imageElement.style.display = 'none';
	};
</script>

<div
	use:ref
	use:hover={isHovering}
	use:focus={isFocusing}
	class="user-preview group"
>
	<span class="text-label-sm whitespace-nowrap">
		{displayName ?? email ?? 'Anonymous'}
	</span>
</div>
{#if $isHovering || $isFocusing}
	<div class="user-preview-popover-box" use:content>
		<div
			class="user-preview-popover"
			in:fade={{ duration: 300, delay: 600, easing: cubicOut }}
			out:fade={{ duration: 300, easing: cubicOut }}
		>
			{#if photoURL !== undefined}
				<img
					bind:this={imageElement}
					src={photoURL}
					alt={displayName}
					class="wh-10 rounded-full object-cover"
					on:error={handleImageError}
				/>
			{/if}
			<div>
				<p class="text-label-sm">{displayName}</p>
				<p class="text-xs text-neutral-400">{email}</p>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.user-preview {
		@apply relative;
		@apply px-2 py-1 rounded-full bg-shade-100 w-fit;
		&:hover {
			@apply shadow bg-shade-50;
		}
	}

	.user-preview-popover-box {
		@apply absolute w-max py-2 z-10 pointer-events-none;
	}

	.user-preview-popover {
		@apply p-2 z-10;
		@apply flex items-center gap-2;
		@apply bg-shade-50 rounded-xl shadow-wide;
	}
</style>
