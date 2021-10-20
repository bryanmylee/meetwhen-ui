<script lang="ts">
	import type { ShallowUser } from '$lib/gql/types';
	import { cssVars } from '$lib/utils/css-vars';

	export let users: ShallowUser[] = [];
	export let textColor: string;
</script>

<div
	class="absolute inset-0 flex flex-wrap items-start gap-1 justify-items-start"
	style={cssVars({ textColor })}
>
	<span class="absolute text-xs font-medium bottom-2 right-2 tag">
		{users.length}
	</span>
</div>

<style lang="postcss">
	.tag {
		color: var(--textColor);
	}
</style>
