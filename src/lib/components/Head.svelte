<script lang="ts">
  export let emoji = '';
  export let subtitle = '';
  export let noRobots = false;
</script>

<svelte:head>
  <title>meetwhen.io {emoji} {subtitle}</title>
  <meta name="description" content="Find the perfect time to meet up with your team" />
  {#if noRobots}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>
