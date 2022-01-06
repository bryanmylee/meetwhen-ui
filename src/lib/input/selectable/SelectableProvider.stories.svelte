<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import SelectableProvider from './SelectableProvider.svelte';

	/**
	 * @type {string[]}
	 */
	let selectedIds = [];
</script>

<Meta
	title="Utility/SelectableProvider"
	component={SelectableProvider}
	argTypes={{
		onToggle: { action: 'onToggle' },
	}}
/>

<Story name="Sample selectable items" source let:args>
	<h1 class="mb-4 text-xl font-bold">Selectable sample</h1>
	<p>{selectedIds.join(', ')}&nbsp;</p>
	<SelectableProvider
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
					data-id={id}
					class="item"
					class:selected={isIdSelected(`${id}`)}
					aria-disabled={isIdDisabled(`${id}`)}
					class:active={isIdActive(`${id}`)}
				>
					{id}
				</div>
			{/each}
		</div>
	</SelectableProvider>
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
</style>
