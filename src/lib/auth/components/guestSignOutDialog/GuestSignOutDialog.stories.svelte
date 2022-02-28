<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import GuestSignOutDialog from './GuestSignOutDialog.svelte';

	let showDialog = true;
</script>

<Meta
	title="Auth/GuestSignOutDialog"
	component={GuestSignOutDialog}
	argTypes={{}}
/>

<Story name="Example guest sign out dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>
		Show guest sign out dialog
	</Button>
	<GuestSignOutDialog
		on:sign-out={() => (showDialog = false)}
		open={showDialog}
		currentSlug="new_slug"
		guestMeeting={{
			name: 'guest meet',
			slug: 'abcdefgh',
		}}
		{...args}
	/>
</Story>
