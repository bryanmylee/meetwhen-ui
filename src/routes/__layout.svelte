<script lang="ts">
	import '../app.css';
	import { primaryVars } from '$lib/core/state';
	import { initFirebase } from '$lib/firebase/config';

	initFirebase();
</script>

<div style={$primaryVars}>
	<slot />
</div>
