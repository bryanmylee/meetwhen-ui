<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Select from './Select.svelte';
	import { range } from '$lib/core/utils/range';

	const names = [
		'Durward Reynolds',
		'Kenton Towne',
		'Therese Wunsch',
		'Benedict Kessler',
		'Katelyn Rohan',
	];
</script>

<Meta title="Input/Select" component={Select} />

<Story name="Sample selects">
	<div class="flex flex-col gap-4">
		<Select value="Default" values={names} />
		<Select value="Disabled" values={names} disabled />
		<Select value="Many items" values={range(50).map((i) => `${i}`)} />
		<Select value="Top position" values={names} top />
		<Select
			value="Top position many items"
			values={range(50).map((i) => `${i}`)}
			top
		/>
		<Select value="Default small" values={names} sm />
		<Select value="Disabled small" values={names} disabled sm />
		<Select value="Many items small" values={range(50).map((i) => `${i}`)} sm />
		<Select value="Top position small" values={names} top sm />
		<Select
			value="Top position many items small"
			values={range(50).map((i) => `${i}`)}
			top
			sm
		/>
	</div>
</Story>
