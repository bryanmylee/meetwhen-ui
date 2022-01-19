<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';

	export let month: Dayjs;
	let today = dayjs();

	$: isCurrentMonth = month.isSame(today, 'month');
	$: isCurrentYear = month.isSame(today, 'year');

	$: monthLabel = month.format(isCurrentYear ? 'MMMM' : 'MMMM YYYY');

	const nextMonth = () => {
		month = month.add(1, 'month');
	};

	const prevMonth = () => {
		if (isCurrentMonth) {
			return;
		}
		month = month.subtract(1, 'month');
	};
</script>

<div class="flex items-center justify-between">
	<Button
		type="button"
		aria-label="previous month"
		variant="text-only"
		disabled={isCurrentMonth}
		class="wh-7"
		icon
		on:click={prevMonth}
	>
		<ChevronLeftIcon />
	</Button>
	<span role="status" class="font-bold">
		{monthLabel}
	</span>
	<Button
		type="button"
		aria-label="next month"
		variant="text-only"
		class="wh-7"
		icon
		on:click={nextMonth}
	>
		<ChevronRightIcon />
	</Button>
</div>
