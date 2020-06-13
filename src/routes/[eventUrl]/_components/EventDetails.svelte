<script>
  // PROPS
  // =====
  export let title;
  export let description;
</script>

<div class="card outline padded">
  <h1>{title}</h1>
  {#if description}
    <p>{description}</p>
  {/if}
</div>

<style>
  h1 {
    margin: 0;
  }

  p {
    margin: 0.5em 0 0;
  }
</style>