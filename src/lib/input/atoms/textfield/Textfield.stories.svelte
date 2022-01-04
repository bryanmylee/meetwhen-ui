<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Textfield from './Textfield.svelte';
</script>

<Meta title="Input/Textfield" component={Textfield} />

<Template let:args>
	<Textfield {...args} />
</Template>

<Story
	name="Text"
	args={{
		label: 'Name',
		password: false,
	}}
/>

<Story
	name="Password"
	args={{
		label: 'Password',
		password: true,
	}}
/>
