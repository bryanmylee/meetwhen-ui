<script lang="ts">
	import { useColor, PRIMARY_HEX } from '../src/lib/colors';

	const { vars: primaryVars } = useColor('primary', PRIMARY_HEX);
</script>

<div style={$primaryVars}>
	<slot />
</div>
