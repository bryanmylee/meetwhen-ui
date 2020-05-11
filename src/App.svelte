<script>
  import { fly } from 'svelte/transition';
  import NewEvent from './components/NewEvent.svelte';

  let showNewEvent = false;
</script>

<main>
  <NewEvent />
</main>

<style>
  :root {
    --text-0: #333;
    --text-1: #555;
    --text-2: #999;
    --text-3: #AAA;
    --accent-1: #62B2F2;
    --line-0: #888;
    --line-1: #cacaca;
    --line-2: #eee;
    --box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  :global(body) {
		width: 100%;
		height: 100%;
    padding: 1em;
	}

	main {
		width: 100%;
		height: 100%;
	}
</style>