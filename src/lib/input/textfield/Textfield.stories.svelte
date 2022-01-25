<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Textfield from './Textfield.svelte';
	import NoLabelTextfield from './NoLabelTextfield.svelte';
	import { timeoutError } from '$lib/test/timeoutError';

	const [ariaValue, ariaError] = timeoutError('');
</script>

<Meta
	title="Input/Textfield"
	component={Textfield}
	argTypes={{
		label: { control: 'text' },
		id: { control: 'text' },
	}}
/>

<Template let:args>
	<Textfield {...args} />
</Template>

<Story name="Sample textfields">
	<h1 class="text-xl font-bold">Textfields</h1>
	<div class="flex flex-col gap-4 mt-4 w-52">
		<Textfield label="Default" />
		<Textfield
			label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem asperiores adipisci perferendis! Suscipit quisquam possimus illum rem, qui fugiat eveniet, vero ducimus cupiditate repudiandae sit beatae ad voluptatum? A."
		/>
		<Textfield label="Password" password />
		<Textfield label="Error" error="Incorrect password" />
		<Textfield label="Required" required />
		<Textfield label="Disabled" disabled />
	</div>
</Story>

<Story
	name="Custom"
	source
	args={{
		label: 'Custom',
	}}
/>

<Story name="ARIA status live update">
	<Textfield label="Type quickly" bind:value={$ariaValue} error={$ariaError} />
</Story>

<Story name="No label textfields">
	<h1 class="text-xl font-bold">Textfields</h1>
	<div class="flex flex-col gap-4 mt-4 w-52">
		<NoLabelTextfield label="Default" />
		<NoLabelTextfield
			label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem asperiores adipisci perferendis! Suscipit quisquam possimus illum rem, qui fugiat eveniet, vero ducimus cupiditate repudiandae sit beatae ad voluptatum? A."
		/>
		<NoLabelTextfield label="Password" password />
		<NoLabelTextfield label="Error" error="Incorrect password" />
		<NoLabelTextfield label="Required" required />
		<NoLabelTextfield label="Disabled" disabled />
	</div>
	<h1 class="text-xl font-bold mt-4">Small textfields</h1>
	<div class="flex flex-col gap-4 mt-4 w-52">
		<NoLabelTextfield label="Default" sm />
		<NoLabelTextfield
			label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem asperiores adipisci perferendis! Suscipit quisquam possimus illum rem, qui fugiat eveniet, vero ducimus cupiditate repudiandae sit beatae ad voluptatum? A."
			sm
		/>
		<NoLabelTextfield label="Password" password sm />
		<NoLabelTextfield label="Error" error="Incorrect password" sm />
		<NoLabelTextfield label="Required" required sm />
		<NoLabelTextfield label="Disabled" disabled sm />
	</div>
</Story>
