<script lang="ts">
	import '../app.css';
	import { primaryVars } from '$lib/core/state';
	import { initFirebaseContext } from '$lib/firebase';

	initFirebaseContext();
</script>

<div style={$primaryVars}>
	<slot />
</div>
