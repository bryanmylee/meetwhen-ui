<script lang="ts">
	import '../app.css';
	import { session } from '$lib/stores';
	import { primaryVars } from '$lib/core/state';
	import { initFirebaseContext } from '$lib/firebase';

	initFirebaseContext($session);
</script>

<div style={$primaryVars}>
	<slot />
</div>
