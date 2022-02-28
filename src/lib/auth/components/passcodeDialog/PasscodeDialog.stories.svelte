<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import PasscodeDialog from './PasscodeDialog.svelte';

	let showDialog = true;
</script>

<Meta title="Auth/PasscodeDialog" component={PasscodeDialog} />

<Story name="Example passcode dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Show code</Button>
	<PasscodeDialog bind:open={showDialog} passcode="ABI190" />
</Story>
