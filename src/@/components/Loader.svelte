<script>
  import range from "@/utils/range";

  export { className as class };
  let className = "";
</script>

<div class="{`${className} flex justify-between items-center`}">
  {#each range(0, 3) as i}
    <div
      class="w-1/5 bg-current rounded-full h-1/5 animate-wave-y"
      style="animation-delay: {i * 0.07}s"
    ></div>
  {/each}
</div>
