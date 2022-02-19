<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import GuestReturningDialog from './GuestReturningDialog.svelte';
	import { withError } from '$lib/core/utils/withError';

	const passcode = withError('');

	let showDialog = true;
</script>

<Meta
	title="Auth/GuestReturningDialog"
	component={GuestReturningDialog}
	argTypes={{
		onShowJoin: { action: 'onShowJoin' },
		onGuestSignIn: { action: 'onGuestSignIn' },
	}}
/>

<Story name="Example guest sign in dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Join Guest</Button>
	<GuestReturningDialog
		bind:open={showDialog}
		on:show-join={args.onShowJoin}
		on:guest-sign-in={args.onGuestSignIn}
		meetingSlug="test_slug"
	/>
</Story>
