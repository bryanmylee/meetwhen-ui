<script lang="ts" context="module">
	export interface LinkItemEvent {
		remove: {
			index: number;
			link: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { XIcon } from 'svelte-feather-icons';
	import { Button, NoLabelTextfield } from '$lib/input';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';

	export let index: number;
	export let link: string;
	export let error = '';

	const dispatch = createEventDispatcher();
</script>

<li class="link-item">
	<NoLabelTextfield
		label="Link input"
		bind:value={link}
		{error}
		class="w-full"
		sm
		use={[focusOnMount]}
	/>
	<Button
		icon
		class="!p-3"
		color="gray"
		on:click={() => dispatch('remove', { index, link })}
	>
		<XIcon class="wh-4" />
	</Button>
</li>

<style lang="postcss">
	.link-item {
		@apply flex items-center gap-2 w-full;
	}
</style>
