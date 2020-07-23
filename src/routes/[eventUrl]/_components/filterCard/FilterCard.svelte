<script>
  import UsernameFilter from './UsernameFilter.svelte';
  import NumberOfUsersFilter from './NumberOfUsersFilter.svelte';

  // PROPS
  // =====
  export let usernames;
</script>

<div class="card outline padded">
  <h3>Filter by username</h3>
  <h5 class="tip">Select a username to see their schedule</h5>
  <UsernameFilter {usernames} />
  <h3>Filter by number of users</h3>
  <h5 class="tip">Minimum number of users</h5>
  <NumberOfUsersFilter {usernames} />
</div>