<script lang="ts" context="module">
  export interface AccordianEvent {
    toggle: {
      expanded: boolean;
    };
    expand: null;
    collapse: null;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<AccordianEvent>();
  import type ReactiveClass from "@/models/ReactiveClass";

  export let expanded = false;
  export { className as class };
  let className = "";
  export let classx: ReactiveClass<{ expanded: boolean }> = null;

  export function expand() {
    expanded = true;
    dispatch("expand");
  }

  export function collapse() {
    expanded = false;
    dispatch("collapse");
  }

  export function toggle() {
    if (expanded) {
      collapse();
    } else {
      expand();
    }
    dispatch("toggle", { expanded });
  }

  function keydown(event: KeyboardEvent) {
    const { key } = event;
    if (key === "Enter" || key === " ") {
      toggle();
    }
  }
</script>

<div class="{`${className} ${classx && classx({ expanded })}`}">
  <div
    tabindex="0"
    on:click="{toggle}"
    on:keydown="{keydown}"
    class="cursor-pointer rounded-xl focusable"
  >
    <slot name="title" expanded="{expanded}" />
  </div>
  {#if expanded}
    <slot expanded="{expanded}" />
  {/if}
</div>
