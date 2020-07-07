<div class="container">
  <div class="container__padding">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points="32,41 50,59 68,41" />
    </svg>
  </div>
</div>

<style>
  .container {
    width: 100%;
    padding-top: 100%;
    position: relative;
  }

  .container__padding {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 6px;
    padding-top: 4px;
  }

  polyline {
    fill: none;
    stroke: var(--line-1);
    stroke-width: 4px;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>