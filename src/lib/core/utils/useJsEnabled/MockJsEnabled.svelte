<script lang="ts">
	import { setContext } from 'svelte';

	export let jsEnabled = true;
	setContext('jsEnabled', jsEnabled);
</script>

<slot />
