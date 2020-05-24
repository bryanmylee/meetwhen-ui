<script>
  import { fade } from 'svelte/transition';

  export let interval;
  const { start, end } = interval;
  const timeString = `${start.format('HH:mm')} - ${end.format('HH:mm')}`;

  let countString = '';
  $: {
    const { length } = interval.usernames;
    if (length === 1) countString = '1 person:';
    else countString = `${length} people:`;
  }
</script>

<div
  transition:fade="{{ duration: 200 }}">
  <h5>{timeString}</h5>
  <h5>{countString}</h5>
  {#each interval.usernames as username}
    <p>{username}</p>
  {/each}
</div>

<style>
  div {
    height: -moz-max-content;
    height: -webkit-max-content;
    background-color: white;
    z-index: 1000;
    padding: 0.5em;
    border-radius: 5px;
    box-shadow: var(--box-shadow);
  }

  h5 {
    margin: 0.2em 0 0.5em;
  }

  p {
    margin: 0.2em 0;
  }
</style>