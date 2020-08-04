<script context="module">
  export async function preload(page) {
    const { eventUrl } = page.params;
    return { eventUrl };
  }
</script>

<script>
  import { goto } from '@sapper/app';

  import { Button } from 'src/components/form';

  export let eventUrl;
</script>

<div class="main-content fixed-height">
  <h1><strong>{eventUrl}</strong> does not exist</h1>

  <h2>Create a new event instead?</h2>

  <Button on:click={() => goto('/new')}>New Event</Button>
</div>

<style>
  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1, h2 {
    font-weight: 400;
    text-align: center;
  }

  h2 {
    margin-bottom: 1em;
  }
</style>