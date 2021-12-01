<script lang="ts">
	import { receive, send } from '$lib/app-state';
	import DatePicker from '$lib/components/date-picker/organisms/DatePicker.svelte';
	import Textfield from '$lib/components/atoms/Textfield.svelte';
	import TimeRangePicker from '$lib/components/time-range-picker/molecues/TimeRangePicker.svelte';
	import { name } from './_state/meeting';
	import { selectedDates, from, to } from './_state/intervals';
</script>

<section class="p-4 space-y-4 card">
	<h1 class="text-2xl font-bold">Start a new meet</h1>
	<div in:receive={{ key: 'new-name' }} out:send={{ key: 'new-name' }} class="flex-1">
		<Textfield
			bind:value={$name}
			placeholder="Name your meet"
			focusOnMount
			required
			class="w-full"
		/>
	</div>
	<h2 class="text-xl font-medium">Set a time for everyone</h2>
	<DatePicker bind:selectedDates={$selectedDates.value} error={$selectedDates.error} />
	<TimeRangePicker bind:from={$from} bind:to={$to} />
</section>
