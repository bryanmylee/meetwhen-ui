<script lang="ts">
  export let isGuestAuth = false;
</script>

<p class="text-sm">
  {#if isGuestAuth}
    Your account will be used for this meeting only
  {:else}
    Your account can be used anywhere on <span>meetwhen</span>
  {/if}
</p>
