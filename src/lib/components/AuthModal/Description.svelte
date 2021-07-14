<script lang="ts">
  import type { Meeting } from '$lib/gql/types';

  export let activeMeeting: Meeting;
  export let isGuestAuth = false;
</script>

{#if isGuestAuth}
  <p class="text-sm">
    Your account will be used for
    <span class="font-bold text-gradient-primary"> this meeting only </span>
  </p>
  <div class="p-4 font-medium !text-primary-text card bg-gradient-primary bg-animate-slow">
    {activeMeeting.name}
  </div>
{:else}
  <p class="text-sm">
    Your account can be used anywhere on
    <span class="font-bold text-gradient-primary"> meetwhen </span>
  </p>
{/if}
