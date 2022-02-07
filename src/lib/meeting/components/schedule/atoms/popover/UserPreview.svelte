<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createPopperActions } from 'svelte-popperjs';
	import { focus } from '$lib/core/utils/useFocus';
	import { hover } from '$lib/core/utils/useHover';

	const [ref, content] = createPopperActions({
		placement: 'bottom-start',
		strategy: 'absolute',
		modifiers: [{ name: 'flip' }],
	});

	export let displayName: string;

	const isHovering = writable(false);
	const isFocusing = writable(false);
</script>

<div
	use:ref
	use:hover={isHovering}
	use:focus={isFocusing}
	class="user-preview group"
>
	<span class="text-label-sm">
		{displayName}
	</span>
</div>
{#if $isHovering || $isFocusing}
	<div class="user-preview-popover-box" use:content>
		<div
			class="user-preview-popover"
			in:fade={{ duration: 300, delay: 600, easing: cubicOut }}
			out:fade={{ duration: 300, easing: cubicOut }}
		>
			<p class="text-neutral-400">{displayName}</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.user-preview {
		@apply relative;
		@apply px-2 py-1 rounded-full bg-shade-100;
	}

	.user-preview-popover-box {
		@apply absolute w-fit max-w-80 py-2 z-10 pointer-events-none;
	}

	.user-preview-popover {
		@apply text-label-sm z-10;
		@apply p-2 bg-shade-50 rounded-xl shadow-wide;
	}
</style>
