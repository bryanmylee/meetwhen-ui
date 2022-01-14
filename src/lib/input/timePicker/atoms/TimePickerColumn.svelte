<script lang="ts">
	import type { Maybe } from '$lib/core/types/Maybe';
	import { dateTimeComposeId } from '$lib/core/utils/dayjs/dateTimeIds';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import type { SelectMode } from '$lib/input/selection/SelectMode';
	import type { TimeCell } from '../types/TimeCell';
	import TimePickerBlockCell from './TimePickerBlockCell.svelte';
	import TimePickerBlockGap from './TimePickerBlockGap.svelte';

	export let dateId: string;
	export let timeCell: TimeCell;
	$: timeId = timeToId(timeCell.time);
	$: dateTimeId = dateTimeComposeId([dateId, timeId]);

	export let isIdSelected: (id: string) => boolean;
	export let isIdCurrent: (id: string) => boolean;
	export let isIdDisabled: (id: string) => boolean;
	export let selectMode: Maybe<SelectMode>;
</script>

<TimePickerBlockCell
	{dateId}
	{timeCell}
	selected={isIdSelected(dateTimeId)}
	current={isIdCurrent(dateTimeId)}
	disabled={isIdDisabled(dateTimeId)}
	{selectMode}
/>
{#if timeCell.isEndOfBlock && !timeCell.isEndOfDate}
	<TimePickerBlockGap {timeCell} />
{/if}
