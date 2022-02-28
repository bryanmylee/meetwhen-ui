<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import GuestJoinDialog from './GuestJoinDialog.svelte';
	import { withError } from '$lib/core/utils';

	const username = withError('');

	let showDialog = true;
</script>

<Meta
	title="Auth/GuestJoinDialog"
	component={GuestJoinDialog}
	argTypes={{
		onGuestJoin: { action: 'onGuestJoin' },
	}}
/>

<Story name="Example join dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Join Guest</Button>
	<GuestJoinDialog
		bind:open={showDialog}
		{...args}
		{username}
		on:guest-join={args.onGuestJoin}
		meetingSlug="test_slug"
	/>
</Story>
