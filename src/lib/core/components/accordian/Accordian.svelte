<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils/classes';

	let className = '';
	export { className as class };
</script>

<Disclosure class="describe {className}" let:open>
	<div class="flex items-center gap-4 w-full">
		<slot name="title">
			<div />
		</slot>
		<DisclosureButton class="focus rounded-full wh-8 p-1">
			<ChevronDownIcon
				class={classes('transition-transform', open && 'rotate-180')}
			/>
		</DisclosureButton>
	</div>
	<DisclosurePanel class="w-full">
		<div
			transition:slide|local={{ duration: 300, easing: cubicOut }}
			class="w-full mt-4"
		>
			<slot />
		</div>
	</DisclosurePanel>
</Disclosure>
