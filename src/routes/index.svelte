<script>
  import { goto } from '@sapper/app';

  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import MaterialButton from '../components/ui/MaterialButton.svelte';
</script>

<div class="page" in:fadeIn out:fadeOut>
  <MaterialButton label="Create New Event" on:click={() => goto('/new')}/>
</div>
