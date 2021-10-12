<script lang="ts">
	import dayjs from 'dayjs';
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import type { Dayjs } from 'dayjs';

	export let month: Dayjs;
	$: isCurrentMonth = month.isSame(dayjs(), 'month');
	$: isCurrentYear = month.isSame(dayjs(), 'year');
	$: monthDisplay = month.format(isCurrentYear ? 'MMMM' : 'MMMM YYYY');

	const increment = () => {
		month = month.add(1, 'month');
	};

	const decrement = () => {
		if (isCurrentMonth) {
			return;
		}
		month = month.subtract(1, 'month');
	};

	const keydown = ({ key }: KeyboardEvent) => {
		if (key === 'ArrowRight') {
			increment();
		} else if (key === 'ArrowLeft') {
			decrement();
		}
	};
</script>

<div tabindex="0" on:keydown={keydown} class="flex justify-between rounded-xl focusable">
	<button
		type="button"
		aria-label="Previous month"
		tabindex="-1"
		class="w-10 h-10 rounded-full button"
		on:click={decrement}
		disabled={isCurrentMonth}
	>
		<ChevronLeftIcon class="p-2" />
	</button>
	<span class="p-2 font-bold">
		{monthDisplay}
	</span>
	<button
		type="button"
		aria-label="Next month"
		tabindex="-1"
		class="w-10 h-10 rounded-full button"
		on:click={increment}
	>
		<ChevronRightIcon class="p-2" />
	</button>
</div>
