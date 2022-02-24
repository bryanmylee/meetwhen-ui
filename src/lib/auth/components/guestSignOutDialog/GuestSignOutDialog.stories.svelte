<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import GuestSignOutDialogPure from './GuestSignOutDialogPure.svelte';

	let showDialog = true;
</script>

<Meta
	title="Auth/GuestSignOutDialog"
	component={GuestSignOutDialogPure}
	argTypes={{}}
/>

<Story name="Example guest sign out dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>
		Show guest sign out dialog
	</Button>
	<GuestSignOutDialogPure
		on:cancel={() => (showDialog = false)}
		open={showDialog}
		currentSlug="new_slug"
		guestMeeting={{
			name: 'old meet',
			slug: 'old_slug',
		}}
		{...args}
	/>
</Story>
