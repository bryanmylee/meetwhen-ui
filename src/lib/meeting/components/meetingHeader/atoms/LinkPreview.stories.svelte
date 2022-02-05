<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import LinkPreview from './LinkPreview.svelte';
</script>

<Meta title="Page/Meeting/LinkPreview" component={LinkPreview} argTypes={{}} />

<Template let:args>
	<div class="flex gap-4 flex-wrap">
		<LinkPreview link="https://svelte.dev/tutorial/basics" {...args} />
		<LinkPreview link="https://github.com/" {...args} />
		<LinkPreview link="https://developer.mozilla.org/en-US/" {...args} />
	</div>
</Template>

<Story name="Simple link preview" source />
