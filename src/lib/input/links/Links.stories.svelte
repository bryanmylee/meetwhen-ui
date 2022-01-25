<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Links from './Links.svelte';

	let links = [
		'https://smu-sg.zoom.us/j/92480930018?pwd=bzhFUDkrOWQyZm1QTDlYS010TkVrdz09',
	];
</script>

<Meta title="Input/Links" component={Links} />

<Story name="Sample links">
	<h1 class="text-xl font-bold">Links</h1>
	<div
		class="flex flex-col gap-4 p-4 my-4 rounded-xl bg-neutral-100 dark:bg-neutral-600"
	>
		{#each links as link}
			<p>
				{link}
			</p>
		{/each}
	</div>
	<Links bind:values={links} />
</Story>
