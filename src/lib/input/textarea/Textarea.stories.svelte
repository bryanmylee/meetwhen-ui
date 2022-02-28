<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Textarea from './Textarea.svelte';
	import { timeoutError } from '$lib/test/timeoutError';

	const [ariaValue, ariaError] = timeoutError('');
</script>

<Meta
	title="Input/Textarea"
	component={Textarea}
	argTypes={{
		label: { control: 'text' },
		id: { control: 'text' },
	}}
/>

<Template let:args>
	<Textarea {...args} />
</Template>

<Story name="Sample textfields">
	<h1 class="text-xl font-bold">Textareas</h1>
	<div class="flex flex-col gap-4 mt-4">
		<Textarea label="Default" />
		<Textarea
			label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure dolorem asperiores adipisci perferendis! Suscipit quisquam possimus illum rem, qui fugiat eveniet, vero ducimus cupiditate repudiandae sit beatae ad voluptatum? A."
		/>
		<Textarea label="Error" error="Incorrect password" />
		<Textarea label="Required" required />
		<Textarea label="Disabled" disabled />
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
	<Textarea label="Type quickly" bind:value={$ariaValue} error={$ariaError} />
</Story>
