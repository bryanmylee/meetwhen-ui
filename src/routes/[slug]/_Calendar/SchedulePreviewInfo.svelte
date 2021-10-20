<script lang="ts">
	import type { ShallowUser } from '$lib/gql/types';
	import { cssVars } from '$lib/utils/css-vars';
	import type { Color } from 'chroma-js';
	import { isDark } from '$lib/app-state';

	export let users: ShallowUser[] = [];
	export let bgColor: Color;
	$: standoutColor = $isDark ? bgColor.brighten(3) : bgColor.darken(3);
</script>

<div
	class="absolute inset-0 flex flex-wrap items-start gap-1 justify-items-start"
	style={cssVars({ standoutColor: standoutColor.css() })}
>
	<span class="absolute text-xs font-medium bottom-2 right-2 tag">
		{users.length}
	</span>
</div>

<style lang="postcss">
	.tag {
		color: var(--standoutColor);
	}
</style>
