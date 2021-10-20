<script lang="ts">
	import type { ShallowUser } from '$lib/gql/types';
	import { cssVars } from '$lib/utils/css-vars';
	import { getContext } from 'svelte';
	import type { Color } from 'chroma-js';
	import type { CalendarState } from './state/core';
	import { isDark } from '$lib/app-state';

	const state = getContext<CalendarState>('state');

	export let users: ShallowUser[] = [];
	export let bgColor: Color;
	$: standoutColor = $isDark ? bgColor.brighten(3) : bgColor.darken(3);
</script>

<div
	class="absolute inset-0 flex flex-wrap items-start gap-1 justify-items-start"
	style={cssVars({ standoutColor: standoutColor.css() })}
>
	<span class="absolute text-xs font-bold bottom-2 right-2 tag">
		{users.length}
	</span>
</div>

<style lang="postcss">
	.tag {
		color: var(--standoutColor);
	}
</style>
