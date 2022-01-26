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
	import { withError } from '$lib/core/utils/withError';
	import { isUrl } from '$lib/input/utils/validation/isUrl';

	export let index: number;
	const link = withError<string>('', {
		validators: [isUrl],
	});
	export let value: string;
	$: value = $link.value;
	export let error = '';
	$: error = $link.error;
	export const validate = link.validate;

	const dispatch = createEventDispatcher();
</script>

<li class="link-item">
	<NoLabelTextfield
		label="Link input"
		bind:value={$link.value}
		{error}
		class="w-full"
		sm
		use={[focusOnMount, link.touch]}
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
