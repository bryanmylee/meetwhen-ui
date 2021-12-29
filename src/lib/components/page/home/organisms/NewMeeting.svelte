<script lang="ts">
	import { goto } from '$app/navigation';
	import { receive, send } from '$lib/app-state';
	import Textfield from '$lib/components/atoms/Textfield.svelte';
	import { ArrowRightIcon } from 'svelte-feather-icons';

	export let meetingName: string;
</script>

<section class="p-4 space-y-4 card">
	<h2 class="text-xl font-medium">
		Start a new
		<span class="font-bold text-gradient-primary"> meet </span>
	</h2>
	<form on:submit|preventDefault={() => goto('/new')} class="flex items-center space-x-4">
		<div in:receive={{ key: 'new-name' }} out:send={{ key: 'new-name' }} class="flex-1">
			<Textfield bind:value={meetingName} placeholder="Name your meet" class="w-full" />
		</div>
		<button type="submit" aria-label="New meeting" class="w-10 h-10 rounded-full button primary">
			<ArrowRightIcon class="p-2" />
		</button>
	</form>
</section>
