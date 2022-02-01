<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Textfield } from '$lib/input';
	import AccordianCard from './AccordianCard.svelte';

	let value = '';
</script>

<Meta title="Core/AccordianCard" component={AccordianCard} />

<Story name="AccordianCard with textfield title" let:args>
	<AccordianCard>
		<Textfield slot="title" label="Name" bind:value />
		<div>
			Content: {value}
		</div>
	</AccordianCard>
</Story>
