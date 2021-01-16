<script lang="ts">
  import { ShareIcon } from 'svelte-feather-icons'
  import { auth } from '@my/state/auth';

  export let eventName = '';
</script>

<div class="flex items-center p-4 text-center text-white bg-gradient-primary card">
  <div class="flex-1">
    <p>
      &nbsp;{eventName}
    </p>
    {#if $auth.data}
      <p class="text-xs italic">
        Logged in as {$auth.data.username}
      </p>
    {/if}
  </div>
  <button class="-m-2 rounded-full button icon">
    <ShareIcon class="p-3"/>
  </button>
</div>

