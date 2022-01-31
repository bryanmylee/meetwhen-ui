<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Textfield } from '$lib/input';
	import Accordian from './Accordian.svelte';

	let value = '';
</script>

<Meta title="Core/Accordian" component={Accordian} />

<Story name="Accordian with textfield title" let:args>
	<Accordian>
		<Textfield slot="title" label="Name" bind:value />
		<div>
			Content: {value}
		</div>
	</Accordian>
</Story>
