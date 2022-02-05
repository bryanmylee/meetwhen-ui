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

<Story name="Name only" source let:args>
	<MeetingHeader name="first meeting" slug="my_slug" {...args} />
</Story>

<Story name="Name and description" source let:args>
	<MeetingHeader
		name="first meeting"
		description={`
Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, vitae, expedita quibusdam obcaecati fuga aut, provident similique velit dicta laudantium unde deserunt deleniti tempora incidunt ea. Vel ducimus sit sed.
		`}
		slug="my_slug"
		{...args}
	/>
</Story>
