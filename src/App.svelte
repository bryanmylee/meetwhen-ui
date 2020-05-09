<script>
	import { fly } from 'svelte/transition';
	import NewEvent from './components/NewEvent.svelte';

	let showNewEvent = false;
</script>

<main>
	<div>
		<!-- {#if !showNewEvent} -->
			<button
				on:click={() => showNewEvent = true}
				transition:fly={{ y: -200, duration: 2000 }}
			>
				Create New Event
			</button>
		<!-- {:else} -->
			<NewEvent />
		<!-- {/if} -->
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>