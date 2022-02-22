<script lang="ts" context="module">
	export interface LinkTextfieldEvent {
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
	import { isHttpUrl } from '$lib/input/utils/validation/isUrl';
	import { focusOnMount } from '$lib/core/actions';
	import { withError } from '$lib/core/utils';

	export let index: number;
	const link = withError<string>('', {
		validators: [isHttpUrl],
	});
	let rawValue = '';
	$: $link.value = rawValue.match(/^\w+:\/\//)
		? rawValue
		: `https://${rawValue}`;

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
		bind:value={rawValue}
		{error}
		class="w-full"
		sm
		use={[focusOnMount, link.touch]}
	/>
	<Button
		class="!p-2"
		color="gray"
		on:click={() => dispatch('remove', { index, link })}
	>
		<XIcon class="wh-5" />
	</Button>
</li>

<style lang="postcss">
	.link-item {
		@apply flex items-center gap-4 w-full;
	}
</style>
