<script lang="ts">
	import { Button } from '$lib/input';

	export let slug: string;
</script>

<section class="h-screen-nav flex flex-col justify-center items-center gap-4">
	<h1 class="slug-title">
		meetwhen.io/<span class="font-mono text-brand">{slug}</span>
	</h1>
	<p class="text-lg mb-4">does not exist</p>
	<Button href="/">Go back home</Button>
</section>

<style lang="postcss">
	.slug-title {
		@apply text-2xl bg-shade-100 p-4 rounded-xl tracking-wide;
	}
</style>
