<script lang="ts">
  export let emoji = '';
  export let subtitle = '';
  export let noRobots = false;
</script>

<svelte:head>
  <title>meetwhen.io {emoji} {subtitle}</title>
  <meta charset="utf-8" />
  <meta name="description" content="Find the perfect time to meet up with your team" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {#if noRobots}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>
