<script lang="ts">
	import type { ShallowMeeting } from '$lib/gql/types';
	import { onSubmitKey } from '$lib/utils/on-submit-key';
	import { ShareIcon } from 'svelte-feather-icons';
	import ShareModal from '../atoms/ShareModal.svelte';
	import { getCssVars, getColorSet } from '$lib/utils/stores/colors-store';
	import { isDark } from '$lib/app-state';

	export let meeting: Pick<ShallowMeeting, 'name' | 'slug' | 'color'>;

	$: colorVars = getCssVars('primary', getColorSet(meeting.color, $isDark));
	let showShareModal = false;
</script>

<div on:click class="relative card overflow-hidden" style={colorVars}>
	<div class="absolute left-0 w-4 h-full bg-gradient-primary" />
	<div class="flex items-center justify-between p-4 ml-4">
		<div>
			<h2 class="text-lg font-medium">
				{meeting.name}&nbsp;
			</h2>
		</div>
		<button
			type="button"
			aria-label="Share"
			on:keydown|stopPropagation={onSubmitKey(() => (showShareModal = true))}
			on:click|preventDefault|stopPropagation={() => (showShareModal = true)}
			class="w-10 h-10 -m-2 rounded-full button hover:text-white hover:bg-primary-darker focus:ring-primary-text"
		>
			<ShareIcon class="p-2.5" />
		</button>
	</div>
</div>

{#if showShareModal}
	<ShareModal slug={meeting.slug} on:dismiss={() => (showShareModal = false)} />
{/if}
