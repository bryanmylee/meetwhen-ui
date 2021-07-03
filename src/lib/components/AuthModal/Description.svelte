<script lang="ts">
  export let isGuestAuth = false;

  const spanClass = 'font-bold text-transparent bg-clip-text bg-gradient-primary';
</script>

<p class="text-sm">
  {#if isGuestAuth}
    Your account will be used for <span class={spanClass}>this meeting only</span>
  {:else}
    Your account can be used anywhere on <span class={spanClass}>meetwhen</span>
  {/if}
</p>
