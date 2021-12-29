<script lang="ts">
	import { Credits, Head } from '../../lib/components/atoms';
	import { isDark } from '$lib/app-state';
</script>

<Head subtitle="help" emoji="🔬" />

<article class="max-w-lg p-6 pb-4 mx-auto space-y-4">
	<section class="p-4 space-y-2 card">
		<h1 class="text-2xl font-bold">Help</h1>
		<p>Learn how to use <span class="font-bold text-gradient-primary">meetwhen</span>!</p>
	</section>
	<div class="flex flex-col items-center dark:text-white">
		<h2>Create a new meeting</h2>
		<img src="/about/new_{$isDark ? 'dark' : 'light'}.gif" alt="Create a new meet" />
		<h2>Join a meeting with others</h2>
		<img src="/about/meeting_joining_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
		<h2>Share your meeting link</h2>
		<img src="/about/meeting_share_{$isDark ? 'dark' : 'light'}.gif" alt="Join a meet" />
	</div>
</article>

<footer class="max-w-lg px-6 pb-4 mx-auto">
	<Credits />
</footer>
