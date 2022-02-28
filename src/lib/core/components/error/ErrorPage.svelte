<script lang="ts">
	export let status: number;
</script>

<section class="h-screen-nav flex flex-col justify-center items-center gap-4">
	<div class="flex items-center gap-4">
		<h2 class="text-title-1">{status}</h2>
		<div>
			<h1 class="text-title-2">Something went wrong</h1>
			<p>Please refresh the page</p>
		</div>
	</div>
</section>
