<script lang="ts" context="module">
  export interface DisplayedMessage {
    timestamp: number;
    content: string;
    timer: number;
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';

  export { className as class };
  let className = '';

  // Bind to the message to allow the toast component a chance to reset the
  // value of the error message.
  export let message = '';

  let displayedMessages: DisplayedMessage[] = [];
  $: updateDisplayedMessages(message);
  function updateDisplayedMessages(newMessage: string) {
    if (newMessage.trim().length === 0) return;
    const timestamp = new Date().getTime();
    displayedMessages = [
      ...displayedMessages,
      {
        timestamp,
        content: newMessage,
        timer: setTimeout(() => {
          displayedMessages = displayedMessages
            .filter(msg => msg.timestamp !== timestamp || msg.content !== newMessage);
        }, messageDuration),
      },
    ];
    message = '';
  }

  export let messageDuration = 3000;
</script>

<div class="fixed left-0 right-0 z-50 flex flex-col-reverse items-center pointer-events-none top-4">
  {#each displayedMessages as { content, timestamp } (content + timestamp)}
    <span
      in:fly={{y:-200, duration:300, easing:cubicOut}}
      out:fade
      animate:flip={{duration:300, easing:cubicOut}}
      class={className}
      >
      {content}
    </span>
  {/each}
</div>

