<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import MeetingHeader from './MeetingHeader.svelte';
</script>

<Meta
	title="Page/Meeting/MeetingHeader"
	component={MeetingHeader}
	argTypes={{
		name: { control: 'text' },
		slug: { control: 'text' },
	}}
/>

<Template let:args>
	<MeetingHeader name="custom meeting" slug="my_slug" {...args} />
</Template>

<Story name="Custom" source />
