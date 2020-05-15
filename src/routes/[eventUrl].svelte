<script context="module">
  import { getEvent } from '../api/event.js';
  console.log('loading module...');
  export async function preload(page, session) {
    console.log('preloading...')
    const { eventUrl } = page.params;
    return getEvent(this, eventUrl);
  }
</script>

<script>
  export let event;
</script>

{JSON.stringify(event)}