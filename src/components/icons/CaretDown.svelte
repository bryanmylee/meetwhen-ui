<script>
  export let color = 'black';
  export let flipped = false;
  export let style = '';
</script>

<div
  {style}
  class:flipped
>
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="32,42 50,60 68,42" style="stroke: {color}"/>
  </svg>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    transition: transform 200ms ease-out;
  }

  div.flipped {
    transform: scaleY(-1);
  }

  svg {
    width: 32px;
    height: 32px;
  }

  polyline {
    fill: none;
    stroke-width: 4px;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>