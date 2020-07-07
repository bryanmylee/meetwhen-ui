<script>
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  // BINDINGS
  // ========
  // The toast component needs to be able to 'reset' the value of the error
  // message such that the same message can be used to trigger another reactive
  // update.
  export let errorMessage = '';
  $: updateDisplayedMessages(errorMessage);

  // PROPS
  // =====
  export let messageDuration = 3000;

  // STATE
  // =====
  // Track all unique messages with timestamp
  let displayedMessages = [];

  // STATE FUNCTIONS
  // ===============
  async function updateDisplayedMessages(newMessage) {
    if (newMessage.trim().length === 0) return;

    const timestamp = (new Date()).getTime();
    displayedMessages = [ ...displayedMessages, {
      timestamp,
      content: newMessage,
      timer: setInterval(function() {
        displayedMessages = displayedMessages.filter(message => {
          return message.timestamp !== timestamp || message.content !== newMessage;
        });
      }, messageDuration),
    }];
    errorMessage = '';
  }
</script>

{#each displayedMessages as { content, timestamp } (`${content}${timestamp}`)}
  <div in:fly={{y: 200, duration: 300, easing: cubicOut}} out:fade>
    <span>{content}</span>
  </div>
{/each}

<style>
  div {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 5rem;
    z-index: 90;
    display: flex;
    justify-content: center;
  }

  span {
    font-size: 0.8rem;
    padding: 0.8rem;
    color: white;
    background-color: var(--error-0);
    border-radius: 5px;
    box-shadow: var(--shadow-med);
  }

  @media screen and (min-width: 768px) {
    div {
      bottom: 2rem;
    }
  }
</style>