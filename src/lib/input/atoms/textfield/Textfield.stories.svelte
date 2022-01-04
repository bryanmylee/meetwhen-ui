<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Textfield from './Textfield.svelte';
</script>

<Meta title="Input/Textfield" component={Textfield} />

<Template let:args>
	<Textfield {...args} />
</Template>

<Story
	name="Empty"
	args={{
		label: 'Name',
	}}
/>

<Story
	name="Filled"
	args={{
		label: 'Name',
		value: 'Adam Smith',
	}}
/>

<Story
	name="Password"
	args={{
		label: 'Password',
		value: 'password',
		password: true,
	}}
/>

<Story
	name="Error"
	args={{
		label: 'Username',
		value: 'adam',
		error: 'Username already taken',
	}}
/>

<Story
	name="Required"
	args={{
		label: 'Date of birth',
		required: true,
	}}
/>

<Story
	name="Disabled"
	args={{
		label: 'Promo code',
		value: '1234',
		disabled: true,
	}}
/>
