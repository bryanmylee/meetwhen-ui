<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { range } from '$lib/core/utils/range';
	import SelectionProvider from './SelectionProvider.svelte';

	/**
	 * @type {string[]}
	 */
	let selectedIds = [];

	const idsBetween = (/** @type {string} */ a, /** @type {string} */ b) => {
		const _a = parseInt(a);
		const _b = parseInt(b);
		return range(Math.min(_a, _b), Math.max(_a, _b) + 1).map((i) =>
			i.toString(),
		);
	};
</script>

<Meta
	title="Utility/SelectionProvider"
	component={SelectionProvider}
	argTypes={{
		onToggle: { action: 'onToggle' },
	}}
/>

<Story name="Sample selection items" source let:args>
	<h1 class="mb-4 text-xl font-bold dark:text-white">Selection sample</h1>
	<SelectionProvider
		bind:selectedIds
		{...args}
		disabledIds={['0', '1']}
		on:toggle={args.onToggle}
		let:isIdSelected
		let:isIdDisabled
		let:isIdActive
	>
		<div class="flex flex-wrap gap-4">
			{#each [...Array(20)] as _, id}
				<div
					data-select-id={id}
					class="item"
					class:selected={isIdSelected(`${id}`)}
					aria-disabled={isIdDisabled(`${id}`)}
					class:active={isIdActive(`${id}`)}
				>
					{id}
				</div>
			{/each}
		</div>
	</SelectionProvider>
</Story>

<Story name="Interpolate betweens" source let:args>
	<h1 class="mb-4 text-xl font-bold dark:text-white">
		Interpolate between start and end
	</h1>
	<SelectionProvider
		bind:selectedIds
		{...args}
		disabledIds={['0', '1']}
		on:toggle={args.onToggle}
		let:isIdSelected
		let:isIdDisabled
		let:isIdActive
		interpolate={idsBetween}
	>
		<div class="flex flex-wrap gap-4">
			{#each [...Array(20)] as _, id}
				<div
					data-select-id={id}
					class="item"
					class:selected={isIdSelected(`${id}`)}
					aria-disabled={isIdDisabled(`${id}`)}
					class:active={isIdActive(`${id}`)}
				>
					{id}
				</div>
			{/each}
		</div>
	</SelectionProvider>
</Story>

<style lang="postcss">
	.item {
		@apply w-12 h-12 flex justify-center items-center;
		@apply rounded-xl bg-white shadow font-bold;
		@apply select-none;
	}
	.item.selected {
		@apply bg-primary-400 text-white;
	}
	.item[aria-disabled='true'] {
		@apply text-gray-200;
	}
	.item.active {
		@apply shadow-lg;
	}
	.item.active.selected {
		@apply bg-primary-300;
	}
</style>
