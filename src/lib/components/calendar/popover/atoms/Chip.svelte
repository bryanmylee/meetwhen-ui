<script lang="ts">
	export let isActive = false;
</script>

<li class="px-2 py-1 rounded-lg {isActive ? 'shade-2' : 'shade'}">
	<slot />
</li>
