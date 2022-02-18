<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import Dialog from './Dialog.svelte';

	let showDialog = true;
</script>

<Meta title="Core/Dialog" component={Dialog} />

<Story name="Example dialog" let:args>
	<Button on:click={() => (showDialog = true)}>Show dialog</Button>
	<Dialog bind:open={showDialog} {...args}>
		<div class="bg-white">Example dialog</div>
	</Dialog>
</Story>
