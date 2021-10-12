<script lang="ts">
	import { page } from '$app/stores';

	$: slug = $page.path.slice(1);
</script>

<div class="flex flex-col max-w-lg p-6 mx-auto space-y-4 h-screen-nav">
	<div class="p-4 card">
		<span class="font-bold">{slug}</span> not found
	</div>
</div>
