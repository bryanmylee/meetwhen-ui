<script lang="ts">
  export let emoji = '';
  export let subtitle = '';
  export let noRobots = false;
</script>

<svelte:head>
  <title>meetwhen {emoji} {subtitle}</title>
  <meta
    name="viewport"
    content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <meta name="description" content="Find the perfect time to meet up with your team" />
  {#if noRobots}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>
