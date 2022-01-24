<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import { Button } from '..';
	import LocalIntervalSelect from './LocalIntervalSelect.svelte';

	/**
	 * @type {import("../../core/types/Interval").Interval}
	 */
	const defaultInterval = {
		start: dayjs().startOf('day').add(8, 'hours'),
		end: dayjs().startOf('day').add(17, 'hours'),
	};

	/**
	 * @type {import("../../core/types/Interval").Interval}
	 */
	let interval = {
		start: dayjs().startOf('day').add(8, 'hours'),
		end: dayjs().startOf('day').add(17, 'hours'),
	};
</script>

<Meta title="Input/LocalIntervalSelect" component={LocalIntervalSelect} />

<Story name="Sample local interval select">
	<div class="flex flex-col gap-4">
		<p>
			{interval?.start.format('ha')}
			to
			{interval?.end.format('ha')}
		</p>
		<LocalIntervalSelect bind:value={interval} />
		<Button on:click={() => (interval = defaultInterval)}>Reset interval</Button
		>
	</div>
</Story>
