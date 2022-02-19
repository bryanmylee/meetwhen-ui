<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import PasscodeInput from './PasscodeInput.svelte';
</script>

<Meta title="Input/PasscodeInput" component={PasscodeInput} argTypes={{}} />

<Template let:args>
	<PasscodeInput {...args} />
</Template>

<Story name="Default passcode input" source />
