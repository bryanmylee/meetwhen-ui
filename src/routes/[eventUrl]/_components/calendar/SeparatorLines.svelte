<div class="container">
  {#each Array(24) as _, inc}
    <div
      class="separator"
      style={`top: calc(var(--row-height) * ${inc})`}
    />
  {/each}
</div>

<style>
  .container {
    pointer-events: none;
    touch-action: none;
  }

  .separator {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: var(--grey-200);
  }
</style>