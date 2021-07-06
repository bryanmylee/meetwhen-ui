<script lang="ts">
  import type { Meeting } from '$lib/gql/types';

  export let activeMeeting: Meeting;
  export let isGuestAuth = false;

  const spanClass = '';
</script>

{#if isGuestAuth}
  <p class="text-sm">Your account will only be used for this meeting</p>
  <div class="card p-4 text-white bg-gradient-primary">
    {activeMeeting.name}
  </div>
{:else}
  <p class="text-sm">
    Your account can be used anywhere on
    <span class="font-bold text-transparent bg-clip-text bg-gradient-primary"> meetwhen </span>
  </p>
{/if}
