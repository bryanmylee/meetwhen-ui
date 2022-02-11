<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import AnonymousJoinDialog from './AnonymousJoinDialog.svelte';
	import { withError } from '$lib/core/utils/withError';

	const username = withError('');

	let showDialog = true;
</script>

<Meta
	title="Auth/AnonymousJoinDialog"
	component={AnonymousJoinDialog}
	argTypes={{
		onShowReturning: { action: 'onShowReturning' },
		onAnonymousJoin: { action: 'onAnonymousJoin' },
	}}
/>

<Story name="Example join dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Join Anonymous</Button>
	<AnonymousJoinDialog
		bind:open={showDialog}
		{...args}
		{username}
		on:show-returning={args.onShowReturning}
		on:anonymous-join={args.onAnonymousJoin}
		meetingSlug="test_slug"
	/>
</Story>
