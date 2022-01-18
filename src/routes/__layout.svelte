<script lang="ts">
	import '../app.css';
	import { session } from '$app/stores';
	import { primaryVars } from '$lib/core/state';
	import type { Session } from '$lib/core/types/Session';
	import { initFirebaseContext } from '$lib/firebase';

	initFirebaseContext($session as Session);
</script>

<div style={$primaryVars}>
	<slot />
</div>
