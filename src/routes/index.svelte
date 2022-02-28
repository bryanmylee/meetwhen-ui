<script lang="ts">
	import { gridArea, gridTemplate } from '$lib/core/components/grid';
	import Head from '$lib/core/components/Head.svelte';
	import { useUser } from '$lib/firebase';
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

<Head />

<header class="header">
	<div class="header-content">
		<h1 class="text-brand text-title-lg w-fit">meetwhen.io</h1>
		<p class="mb-2 ml-1 text-subtitle">Find the perfect time together</p>
		<Button color="gradient" href="/new" class="w-fit">
			Get started for free
		</Button>
	</div>
	<div
		class="header-bg"
		style:display="grid"
		style:grid-template={gridTemplate({ rows: 5, cols: 5 })}
	>
		{#each cells as { x, y, opacity }}
			<div
				class="header-bg-item"
				style:grid-area={gridArea({ x, y })}
				style:--opacity={opacity}
			/>
		{/each}
	</div>
</header>

<style lang="postcss">
	.header {
		@apply relative w-full lg:h-[600px] p-8;
		@apply aspect-video lg:aspect-auto;
		@apply overflow-hidden;
	}

	.header-content {
		@apply container h-full mx-auto p-4;
		@apply flex flex-col justify-center gap-4 md:gap-8;
	}

	.header-bg {
		@apply absolute -top-4 bottom-0 left-1/2 -right-4 pointer-events-none;
	}

	.header-bg-item {
		@apply rounded-xl bg-primary-400;
		opacity: var(--opacity);
	}
</style>
