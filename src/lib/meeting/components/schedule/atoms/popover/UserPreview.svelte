<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createPopperActions } from 'svelte-popperjs';
	import { focus, hover } from '$lib/core/actions';

	const [ref, content] = createPopperActions({
		strategy: 'absolute',
		placement: 'bottom',
		modifiers: [{ name: 'flip' }],
	});

	export let unavailable = false;
	export let displayName: Maybe<string>;
	export let email: Maybe<string>;
	$: name = displayName ?? email ?? 'anonymous';
	$: isGuest = email?.endsWith('.guest');
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
	<div class="flex items-center gap-2 h-5">
		{#if photoURL !== undefined}
			<img
				bind:this={imageElement}
				src={photoURL}
				alt={displayName}
				class="wh-5 -ml-1 user-photo"
				class:opacity-50={unavailable}
				on:error={handleImageError}
			/>
		{/if}
		<span
			class="text-label-sm whitespace-nowrap"
			class:opacity-50={unavailable}
		>
			{name}
		</span>
	</div>
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
					class="wh-10 user-photo"
					on:error={handleImageError}
				/>
			{/if}
			<div>
				<p class="text-label-sm">{displayName}</p>
				<p class="text-xs text-neutral-400">
					{#if isGuest}
						guest
					{:else}
						{email}
					{/if}
				</p>
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

	.user-photo {
		@apply rounded-full object-cover;
	}
</style>
