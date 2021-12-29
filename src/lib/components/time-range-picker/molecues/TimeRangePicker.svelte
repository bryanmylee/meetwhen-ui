<script lang="ts">
	import { Select } from '$lib/components/select';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { EARLIEST_OFFSET, HOURS, toDisplay, toId, UTCToDisplay, UTC_OFFSETS } from '../utils';

	let fromIndex = 9;
	let toIndex = 7;

	$: fromHour = HOURS[fromIndex];
	$: toHours = HOURS.map((hour) => hour.add(fromHour.hour() + 1, 'hour'));
	$: toHour = toHours[toIndex];

	const currentUTC = Math.floor(dayjs().utcOffset() / 60);

	let selectedUTCIndex = currentUTC - EARLIEST_OFFSET;
	$: selectedUTC = UTC_OFFSETS[selectedUTCIndex];
	$: UTCOffset = selectedUTC - currentUTC;

	export let from: Dayjs = undefined;
	export let to: Dayjs = undefined;
	$: {
		from = fromHour.add(UTCOffset, 'hour');
		to = toHour.add(UTCOffset, 'hour');
	}
</script>

<div class="flex items-center space-x-4">
	<Select
		bind:index={fromIndex}
		items={HOURS}
		getDisplay={toDisplay}
		getId={toId}
		class="flex-auto shade rounded-xl"
	/>
	<span>to</span>
	<Select
		bind:index={toIndex}
		items={toHours}
		getDisplay={toDisplay}
		getId={toId}
		class="flex-auto shade rounded-xl"
	/>
	<Select
		bind:index={selectedUTCIndex}
		items={UTC_OFFSETS}
		getDisplay={UTCToDisplay}
		class="!ml-0 !-mr-2 text-xs font-bold rounded-xl"
	/>
</div>
