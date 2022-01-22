<script lang="ts" context="module">
	const timeOptions = range(24).map((hour) =>
		dayjs().startOf('day').add(hour, 'hours'),
	);

	const durations = range(1, 25);

	const getToItemLabel = (toHour: Dayjs) => {
		if (toHour.isSame(dayjs(), 'day')) {
			return toHour.format('ha');
		}
		return (
			toHour.format('ha') +
			' <span class="text-xs italic text-current">next day</span>'
		);
	};

	const getTimezoneLabel = (tz: typeof timezones[number]) => {
		const tzName = tz.tzCode.replace(/_/g, ' ');
		return `
      <span class="w-full flex justify-between items-center text-current text-xs font-medium">
        <span class="text-current overflow-hidden overflow-ellipsis">${tzName}&nbsp;</span>
        <span class="text-current">${tz.utc}</span>
      </span>
    `;
	};
</script>

<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import timezones from 'timezones-list';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import { getCurrentTimezone } from '$lib/core/utils/dayjs/getCurrentTimezone';
	import { onDay } from '$lib/core/utils/dayjs/onDay';
	import { range } from '$lib/core/utils/range';
	import {
		Textfield,
		DatePicker,
		Select,
		TimeConstraintPicker,
	} from '$lib/input';
	import type { Interval } from '$lib/core/types/Interval';

	export let selectedDates: Dayjs[] = [];
	export let fromTime = timeOptions[8];
	export let duration = 9;
	export let timezoneId = getCurrentTimezone();
	$: timezone =
		timezones.find((tz) => tz.tzCode === timezoneId) ?? timezones[0];

	$: totalValidIntervals = selectedDates.map((date) => ({
		start: onDay(fromTime, date),
		end: onDay(fromTime, date).add(duration, 'hours'),
	}));
	let validIntervals: Interval[] = [];
	$: validIntervals = totalValidIntervals;
</script>

<section>
	<div class="container mx-auto p-8">
		<form class="flex flex-col gap-4">
			<h1 class="text-xl font-bold">Start a new meet</h1>
			<Textfield label="Name of your meet" />
			<DatePicker bind:value={selectedDates} />
			<div class="time-select-grid">
				<label for="select-from-time">From</label>
				<Select
					id="select-from-time"
					bind:value={fromTime}
					values={timeOptions}
					itemId={timeToId}
					itemLabel={(t) => t.format('ha')}
					top
				/>
				<label for="select-to-time">To</label>
				<Select
					id="select-to-time"
					value={duration}
					values={durations}
					itemId={(d) => timeToId(fromTime.add(d, 'hour'))}
					itemLabel={(d) => getToItemLabel(fromTime.add(d, 'hour'))}
					top
				/>
				<label for="select-timezone" class="md:sr-only">Timezone</label>
				<Select
					id="select-timezone"
					value={timezone}
					values={timezones}
					itemId={(tz) => tz?.tzCode ?? ''}
					itemLabel={getTimezoneLabel}
					top
				/>
			</div>
			<TimeConstraintPicker
				bind:value={validIntervals}
				validIntervals={totalValidIntervals}
			/>
		</form>
	</div>
</section>

<style lang="postcss">
	.time-select-grid {
		@apply grid gap-4 items-center;
		grid-template-columns: auto 1fr;
		@apply md:flex;
		& > label {
			@apply text-right font-medium;
		}
	}
</style>
