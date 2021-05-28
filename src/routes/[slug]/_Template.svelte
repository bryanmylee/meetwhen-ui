<script lang="ts">
  import { media } from '$lib/media';
</script>

{#if $media.md}
  <div class="flex p-6 mx-auto space-x-4 h-screen-nav max-w-7xl">
    <div class="space-y-4 min-w-72">
      <slot name="header" />
      <slot name="buttons" />
    </div>
    <slot name="calendar" />
  </div>
{:else}
  <div class="flex flex-col max-w-lg p-6 mx-auto space-y-4 h-screen-nav">
    <slot name="header" />
    <slot name="calendar" />
    <slot name="buttons" />
  </div>
{/if}
