<script>
  import UsernameFilter from './UsernameFilter.svelte';
  import NumberOfUsersFilter from './NumberOfUsersFilter.svelte';

  // PROPS
  // =====
  export let usernames;
</script>

<div class="card outline padded">
  <h3>Filter</h3>
  {#if usernames.length === 0}
    <p>Nobody attending</p>
  {:else}
    <h5 class="tip">Select a username to see their schedule</h5>
    <UsernameFilter {usernames} />
    <h5 class="tip">Minimum number of users</h5>
    <NumberOfUsersFilter {usernames} />
  {/if}
</div>