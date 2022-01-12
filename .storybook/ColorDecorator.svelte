<script lang="ts">
	import { useColor, PRIMARY_HEX } from '../src/lib/colors';

	const { vars: primaryVars } = useColor('primary', PRIMARY_HEX);
</script>

<div style={$primaryVars}>
	<slot />
</div>

<style lang="postcss">
	div {
		@apply -m-4 p-4 min-h-screen;
		@apply bg-white gdark:bg-neutral-800;
	}
</style>
