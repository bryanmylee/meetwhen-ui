<script lang="ts">
  import { onMount } from 'svelte';

  export let value = '📘';

  const handleEmojiClick = ({ detail }) => {
    value = detail.unicode;
  };

  let containerElement: HTMLDivElement;
  onMount(async () => {
    const { default: Picker } = await import('emoji-picker-element/svelte');
    const picker = new Picker({
      skinToneEmoji: '👍',
    });
    containerElement.appendChild(picker);
    picker.addEventListener('emoji-click', handleEmojiClick);
    return () => {
      picker.removeEventListener('emoji-click', handleEmojiClick);
    };
  });
</script>

<div bind:this={containerElement} />
