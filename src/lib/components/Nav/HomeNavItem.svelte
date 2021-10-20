<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<li class="relative z-0 pointer-events-none" transition:fade={{ duration: 300 }}>
	<span class="text-xl font-bold text-gradient-primary"> meetwhen </span>
	<a
		href="/"
		class="absolute inset-0 text-xl font-bold pointer-events-auto z-[-1] text-primary hover:underline text-focusable"
	>
		meetwhen
	</a>
</li>
