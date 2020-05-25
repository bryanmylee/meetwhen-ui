<script>
  import { goto } from '@sapper/app';

  import { fadeIn, fadeOut } from '../utils/pageCrossfade.js';
  import { Button } from '../components/form';
</script>

<div class="page" in:fadeIn out:fadeOut>
  <h1>LetsMeet</h1>
  <Button on:click={() => goto('/new')}>Create New Event</Button>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>