<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import ErrorPage from './ErrorPage.svelte';
</script>

<Meta title="Page/ErrorPage" component={ErrorPage} />

<Template let:args>
	<ErrorPage status={404} {...args} />
</Template>

<Story name="Example error page" source />
