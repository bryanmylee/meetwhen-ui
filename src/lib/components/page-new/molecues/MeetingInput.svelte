<script lang="ts">
	import DatePicker from '$lib/components/date-picker/organisms/DatePicker.svelte';
	import Textfield from '$lib/components/atoms/Textfield.svelte';
	import TimeRangePicker from '$lib/components/time-range-picker/molecues/TimeRangePicker.svelte';
	import type { Dayjs } from 'dayjs';
	import { receive, send } from '$lib/app-state';

	export let name: string;
	export let selectedDates: Dayjs[];
	export let from: Dayjs;
	export let to: Dayjs;

	export let selectedDatesError: string;
</script>

<section class="p-4 space-y-4 card">
	<h1 class="text-2xl font-bold">Start a new meet</h1>
	<div in:receive={{ key: 'new-name' }} out:send={{ key: 'new-name' }} class="flex-1">
		<Textfield
			bind:value={name}
			placeholder="Name your meet"
			focusOnMount
			required
			class="w-full"
		/>
	</div>
	<h2 class="text-xl font-medium">Set a time for everyone</h2>
	<DatePicker bind:selectedDates error={selectedDatesError} />
	<TimeRangePicker bind:from bind:to />
</section>
