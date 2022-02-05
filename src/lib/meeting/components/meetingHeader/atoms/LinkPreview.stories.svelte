<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import LinkPreview from './LinkPreview.svelte';
</script>

<Meta title="Page/Meeting/LinkPreview" component={LinkPreview} argTypes={{}} />

<Template let:args>
	<LinkPreview link="https://svelte.dev/tutorial/basics" {...args} />
</Template>

<Story name="Simple link preview" source />
