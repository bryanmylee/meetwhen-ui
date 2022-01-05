<script lang="ts">
	import '../app.css';
	import { primaryVars } from '$lib/core/state';
</script>

<div style={$primaryVars}>
	<slot />
</div>
