<script>
  import { getEvent } from '../api/event.js';
  import { stores } from '@sapper/app';
  const { page } = stores();
  const { eventUrl } = $page.params;
  let promise = getEvent(eventUrl);
</script>

{#await promise}
  <p>...waiting</p>
{:then event}
  {JSON.stringify(event)}
  {event}
{:catch err}
  {JSON.stringify(err)}
{/await}