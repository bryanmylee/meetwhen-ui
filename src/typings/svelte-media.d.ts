declare module 'svelte-media' {
  import type { Readable } from 'svelte/store';
  function watchMedia<Query>(
    queries: { [K in keyof Query]: string }
  ): Readable<{ [K in keyof Query]: boolean }>;
  export default watchMedia;
}
