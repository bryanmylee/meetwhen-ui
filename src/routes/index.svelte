<script lang="ts">
	import { gridItemStyle, gridStyle } from '$lib/core/components/grid';
	import { cssVars } from '$lib/core/utils/cssVars';
	import { useUser } from '$lib/firebase/context';
	import { Button } from '$lib/input';

	const user = useUser();

	const cells = [
		{ x: 0, y: 0, opacity: 0.3 },
		{ x: 1, y: 3, opacity: 0.5 },
		{ x: 2, y: 2, opacity: 0.1 },
		{ x: 3, y: 4, opacity: 0.8 },
		{ x: 4, y: 1, opacity: 0.7 },
	];
</script>

<header class="header">
	<div class="header-content">
		<h1 class="text-brand text-4xl md:text-6xl font-bold w-fit">meetwhen.io</h1>
		<p class="text-base md:text-xl ml-1">Find the perfect time together</p>
		<Button href="/new" class="w-fit">Get started for free</Button>
	</div>
	<div class="header-bg" style={gridStyle({ rows: 5, cols: 5 })}>
		{#each cells as { x, y, opacity }}
			<div
				class="header-bg-item"
				style="{gridItemStyle({ x, y })} {cssVars({ opacity })}"
			/>
		{/each}
	</div>
</header>

<style lang="postcss">
	.header {
		@apply relative w-full lg:h-[600px];
		@apply aspect-video lg:aspect-auto;
		@apply overflow-hidden;
	}

	.header-content {
		@apply container h-full mx-auto p-8;
		@apply flex flex-col justify-center gap-4 md:gap-8;
	}

	.header-bg {
		@apply absolute -inset-8 bottom-0 left-1/2 pointer-events-none;
	}

	.header-bg-item {
		@apply rounded-xl bg-primary-400;
		opacity: var(--opacity);
	}
</style>
