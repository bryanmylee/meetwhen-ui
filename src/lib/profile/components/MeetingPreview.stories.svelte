<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import MeetingPreview from './MeetingPreview.svelte';
</script>

<Meta
	title="Page/Profile/MeetingPreview"
	component={MeetingPreview}
	argTypes={{}}
/>

<Template let:args>
	<MeetingPreview {...args} />
</Template>

<Story
	name="Loading meeting preview"
	source
	args={{
		name: 'loading',
		slug: 'loading',
		isLoading: true,
	}}
/>

<Story
	name="Example meeting preview"
	source
	args={{
		name: 'example meeting',
		slug: 'abcdefgh',
	}}
/>
