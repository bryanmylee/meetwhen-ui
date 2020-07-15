<script>
  import { goto } from '@sapper/app';

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade.js';
  import { Button } from 'src/components/form';
</script>

<div class="main-content fixed-height" in:fadeIn out:fadeOut>
  <h1>LetsMeet</h1>
  <Button on:click={() => goto('/new')}>Create New Event</Button>
</div>

<style>
  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin: 1rem;
  }
</style>