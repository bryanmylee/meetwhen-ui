<script lang="ts" context="module">
	let hoveredId: Writable<Maybe<number>> = writable(undefined);
	let activeId: Writable<Maybe<number>> = writable(undefined);
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { UserIdsInterval } from '$lib/core/types';
	import { intervalGridArea } from '$lib/input/timePicker/utils/intervalGridArea';
	import { clickOutside } from '$lib/core/actions';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '$lib/input/timePicker/utils/timePickerContext';
	import { getScheduleAdjacencySet } from '../utils/schedulePickerContext';
	import SchedulePopover from './popover/SchedulePopover.svelte';
	import { primaryScale, useIsDark } from '$lib/core/state';
	import type { SelectMode } from '$lib/input';

	const isDark = useIsDark();
	const scheduleAdjacencySet = getScheduleAdjacencySet();
	$: hasTopNeighbor = $scheduleAdjacencySet.includes(interval.start);
	$: hasBottomNeighbor = $scheduleAdjacencySet.includes(interval.end);

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
	$: textColor =
		bgColor.luminance() < 0.3 ? bgColor.brighten(4) : bgColor.darken(4);

	export let editing = false;
	export let selectMode: Maybe<SelectMode>;

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

	$: showPopover = (isActive || isHovered) && selectMode === undefined;
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
	class:has-top={hasTopNeighbor}
	class:has-bottom={hasBottomNeighbor}
	style:--bg={bgColor.css()}
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
	<p
		class="schedule-tag"
		class:hidden={editing}
		style:--color={textColor.css()}
	>
		{interval.userIds.size}
	</p>
</div>

<style lang="postcss">
	.schedule-interval {
		background-color: var(--bg);
		@apply relative wh-full pointer-events-auto;

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
			width: calc(var(--scheduleWidth) - 2px);
			@apply !rounded-r-none;
		}

		&:not(.has-top) {
			@apply rounded-t-xl;
		}

		&.has-bottom {
			@apply border-b-2 border-white gdark:border-neutral-800;
		}

		&:not(.has-bottom) {
			@apply rounded-b-xl;
		}
	}

	.schedule-tag {
		color: var(--color);
		@apply text-label-sm absolute right-2 bottom-1 pointer-events-none;
	}
</style>
