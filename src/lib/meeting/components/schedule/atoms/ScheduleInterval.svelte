<script lang="ts" context="module">
	let hoveredId: Writable<Maybe<number>> = writable(undefined);
	let activeId: Writable<Maybe<number>> = writable(undefined);
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { UserIdsInterval } from '$lib/core/types/UserIdsInterval';
	import { intervalGridArea } from '$lib/input/timePicker/utils/intervalGridArea';
	import { clickOutside } from '$lib/core/utils/useClickOutside';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '$lib/input/timePicker/utils/timePickerContext';
	import SchedulePopover from './popover/SchedulePopover.svelte';
	import { primaryScale, useIsDark } from '$lib/core/state';

	const isDark = useIsDark();

	export let interval: UserIdsInterval;
	$: id = interval.start.unix();
	$: isActive = $activeId === id;
	$: isHovered = $hoveredId === id;

	export let maxUserCountPerInterval: number;
	$: bgColor = $primaryScale(
		interval.userIds.size,
		maxUserCountPerInterval,
		$isDark,
	);

	export let editing = false;

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();

	const handleClick = (event: MouseEvent) => {
		if (isActive) {
			$activeId = undefined;
		} else {
			$activeId = id;
		}
		popover?.updateRefPosition(event);
	};

	const handleClickOutside = () => {
		if (isActive) {
			$activeId = undefined;
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isActive) {
			popover?.updateRefPosition(event);
		}
	};

	let popover: Maybe<SchedulePopover> = undefined;
	let referenceElement: HTMLDivElement;

	$: showPopover = isActive || isHovered;
</script>

<div
	class="schedule-interval"
	class:editing
	class:active={isActive}
	class:show-popover={showPopover}
	on:click={handleClick}
	use:clickOutside={handleClickOutside}
	on:mouseenter={() => ($hoveredId = id)}
	on:mouseleave={() => ($hoveredId = undefined)}
	on:mousemove={handleMouseMove}
	on:transitionend={() => popover?.updatePopoverPosition()}
	style:--bgColor={bgColor}
	style:grid-area={intervalGridArea({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval,
	})}
>
	<div bind:this={referenceElement} class="w-full" />
	<SchedulePopover
		bind:this={popover}
		show={showPopover}
		{isActive}
		{referenceElement}
		{interval}
	/>
</div>

<style lang="postcss">
	.schedule-interval {
		background-color: var(--bgColor);
		@apply relative wh-full pointer-events-auto;
		@apply rounded-xl;

		&.show-popover {
			@apply ring-2 ring-offset-[3px] ring-inset ring-white gdark:ring-neutral-800;
		}

		&:hover:not(.active) {
			@apply ring-offset-neutral-400;
		}

		&.active {
			@apply ring-offset-primary-400 gdark:ring-offset-primary-300;
		}

		transition: width 300ms var(--cubicOut);
		&.editing {
			width: var(--scheduleWidth);
			@apply rounded-r-none;
		}
	}
</style>
