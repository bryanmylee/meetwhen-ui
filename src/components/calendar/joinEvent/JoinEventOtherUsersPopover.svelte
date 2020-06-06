<script>
  export let start;
  export let end;
  export let usernames

  const timeString = `${start.format('HH:mm')} - ${end.format('HH:mm')}`;
  const countString = usernames.length === 1
      ? '1 person:'
      : `${usernames.length} people:`;
</script>

<div>
  <h5>{timeString}</h5>
  <h5>{countString}</h5>
  {#each usernames as username}
    <p>{username}</p>
  {/each}
</div>

<style>
  div {
    z-index: 30;
    width: -moz-max-content;
    width: -webkit-max-content;
    height: -moz-max-content;
    height: -webkit-max-content;
    background-color: white;
    padding: 0.5em;
    border-radius: 5px;
    box-shadow: var(--shadow-med);
  }

  h5 {
    margin: 0.2em 0 0.5em;
  }

  p {
    margin: 0.2em 0;
  }
</style>