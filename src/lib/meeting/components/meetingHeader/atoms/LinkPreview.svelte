<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createPopperActions } from 'svelte-popperjs';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { hover } from '$lib/core/utils/useHover';
	import { Button } from '$lib/input';

	const [ref, content] = createPopperActions({
		placement: 'bottom-start',
		strategy: 'absolute',
		modifiers: [{ name: 'flip' }],
	});

	export let link: string;

	let url: Maybe<URL>;
	$: try {
		url = new URL(link);
	} catch {
		url = undefined;
	}

	let title: Maybe<string>;
	let description: Maybe<string>;
	let favicon: Maybe<string>;
	$: loadPreview(link);
	const loadPreview = async (previewLink: string) => {
		// TODO dynamically configure this route.
		const res = await fetch('/api/link-preview', {
			method: 'post',
			headers: { 'content-type': 'text/plain' },
			body: previewLink,
		});
		const data = await res.json();
		if (data.title !== undefined) {
			title = data.title;
		}
		if (data.description !== undefined) {
			description = data.description;
		}
		if (data.favicons?.[0] !== undefined) {
			favicon = data.favicons[0];
		}
	};

	const isHovering = writable(false);
</script>

<Button
	href={link}
	size="sm"
	color="gray"
	use={[ref, [hover, isHovering]]}
	class="link-preview group"
>
	{#if favicon !== undefined}
		<div class="wh-4">
			<img src={favicon} alt="favicon" />
		</div>
	{/if}
	<span class="text-label">
		{title ?? url?.host}
	</span>
</Button>
{#if $isHovering}
	<div class="link-preview-popover-box" use:content>
		<div
			class="link-preview-popover"
			in:fade={{ duration: 300, easing: cubicOut }}
			out:fade={{ duration: 300, delay: 300, easing: cubicOut }}
		>
			<p class="text-neutral-400">
				{link}
			</p>
			{#if description !== undefined}
				<p>
					{description}
				</p>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(.link-preview) {
		@apply relative flex items-center gap-2;
	}

	.link-preview-popover-box {
		@apply absolute w-fit max-w-80 py-2 z-10;
	}

	.link-preview-popover {
		@apply text-label-sm z-10;
		@apply p-2 bg-shade-50 rounded-xl shadow-wide;
	}
</style>
