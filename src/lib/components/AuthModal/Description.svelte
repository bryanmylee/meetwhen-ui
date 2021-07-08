<script lang="ts">
  import type { Meeting } from '$lib/gql/types';

  export let activeMeeting: Meeting;
  export let isGuestAuth = false;
</script>

{#if isGuestAuth}
  <p class="text-sm">
    Your account will be used for
    <span class="font-bold text-transparent bg-clip-text bg-gradient-primary bg-animated-slow">
      this meeting only
    </span>
  </p>
  <div class="card p-4 text-white bg-gradient-primary font-medium">
    {activeMeeting.name}
  </div>
{:else}
  <p class="text-sm">
    Your account can be used anywhere on
    <span class="font-bold text-transparent bg-clip-text bg-gradient-primary"> meetwhen </span>
  </p>
{/if}
