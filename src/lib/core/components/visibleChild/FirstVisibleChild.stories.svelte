<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import { focusOnMount } from '$lib/core/actions';
	import FirstVisibleChild from './FirstVisibleChild.svelte';

	/** @type {import('./FirstVisibleChild.svelte').default} */
	let firstVisibleChild;
</script>

<Meta
	title="Utility/FirstVisibleChild"
	component={FirstVisibleChild}
	argTypes={{}}
/>

<Story name="Add class to first visible child" source>
	<Button on:click={firstVisibleChild?.update}>Update visible</Button>
	<div class="mt-4 p-2 grid grid-cols-4 gap-2 w-fit h-60 overflow-y-scroll">
		{#each { length: 40 } as _, index}
			<button {...index % 2 === 0 ? { 'data-select-id': index } : {}} class="">
				<p>
					{index}
				</p>
			</button>
		{/each}
		<FirstVisibleChild
			bind:this={firstVisibleChild}
			requiredAttribute="data-select-id"
			use={[focusOnMount]}
		/>
	</div>
</Story>

<style lang="postcss">
	button {
		@apply focus flex justify-center items-center wh-16 bg-shade-100 rounded-xl;
	}
</style>
