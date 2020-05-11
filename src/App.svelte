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
    --text-2: #777;
    --text-3: #AAA;
    --primary-0: #3D5A80;
    --primary-1-0: #4E90CD;
    --primary-1: #62B2F2;
    --primary-1-1: #75C1F5;
    --primary-2: #E0FBFC;
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

  :global(.card) {
    border-radius: 2px;
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
  }

  @media (min-width: 900px) {
    :global(main) {
      max-width: 900px;
      margin: auto;
    }
  }

	main {
		width: 100%;
		height: 100%;
	}
</style>