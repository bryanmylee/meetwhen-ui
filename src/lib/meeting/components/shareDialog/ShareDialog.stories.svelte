<script>
	import { Button } from '$lib/input';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import ShareDialog from './ShareDialog.svelte';

	let open = true;
</script>

<Meta title="Page/Meeting/ShareDialog" component={ShareDialog} />

<Story name="Sample share dialog">
	<Button on:click={() => (open = !open)}>Share</Button>
	<ShareDialog bind:open slug="abcdefghi" />
</Story>
