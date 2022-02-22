<script>
	import { Button } from '$lib/input';
	import { setLoading } from '$lib/loading';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import { writable } from 'svelte/store';

	import LoadingPasscodeInput from './LoadingPasscodeInput.svelte';

	const isLoading = writable(true);

	setLoading(isLoading);
</script>

<Meta
	title="Input/Loading/PasscodeInput"
	component={LoadingPasscodeInput}
	argTypes={{}}
/>

<Template let:args>
	<div class="flex flex-col gap-4">
		<Button on:click={() => ($isLoading = !$isLoading)}>Toggle loading</Button>
		<LoadingPasscodeInput {...args} />
	</div>
</Template>

<Story name="Default passcode input" source />
