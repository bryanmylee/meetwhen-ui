<script context="module">
  console.log('loading module...');
  export async function preload(page, session) {
    console.log('preloading...')
    const { eventUrl } = page.params;
    const res = await this.fetch(`http://localhost:5000/${eventUrl}`, {
      credentials: 'include',
    });
    const event = await res.json();
    return { event };
  }
</script>

<script>
  export let event;
</script>

{JSON.stringify(event)}