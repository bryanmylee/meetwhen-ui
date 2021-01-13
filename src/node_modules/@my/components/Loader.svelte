<script>
  import range from '@my/utils/range';

  export { className as class };
  let className = '';
</script>

<div class={`${className} flex justify-between items-center`}>
  {#each range(0, 3) as i}
    <div
      class="w-1/5 h-1/5 rounded-full bg-current animate-wave-y"
      style="animation-delay: {i * 0.07}s"
    />
  {/each}
</div>

