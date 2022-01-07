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
		color="gray"
		disabled={isCurrentMonth}
		on:click={prevMonth}
		class="w-10 h-10 !p-2"
		aria-label="previous month"
	>
		<ChevronLeftIcon />
	</Button>
	<span role="status" class="text-lg font-bold text-default">
		{monthLabel}
	</span>
	<Button
		type="button"
		color="gray"
		aria-label="next month"
		class="w-10 h-10 !p-2"
		on:click={nextMonth}
	>
		<ChevronRightIcon />
	</Button>
</div>
