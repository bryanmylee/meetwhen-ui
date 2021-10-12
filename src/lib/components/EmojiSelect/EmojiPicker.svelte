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
		picker.shadowRoot.appendChild(getCustomStyle());
		picker.addEventListener('emoji-click', handleEmojiClick);
		return () => {
			picker.removeEventListener('emoji-click', handleEmojiClick);
		};
	});

	const getCustomStyle = () => {
		const style = document.createElement('style');
		style.textContent = `
      .picker {
        display: flex;
        flex-direction: column;
        padding: 0.75rem;
        background: var(--picker-bg);
        border-width: 0;
        border-radius: 0.75rem;
        box-shadow: var(--picker-shadow);
      }
      .pad-top {
        display: none;
      }
      .skintone-button-wrapper {
        background: var(--picker-bg);
      }
      .skintone-list {
        background: var(--picker-bg);
        box-shadow: var(--picker-shadow);
        border-bottom: none;
      }
      .search-row {
        padding-left: 0;
      }
      .search-wrapper {
        margin-right: 0.5rem;
      }
      #search {
        color: var(--picker-color);
        width: 100%;
        border-width: 0;
        padding: 0.5rem;
        background: var(--picker-shade);
      }
      #search:focus {
        box-shadow: 0 0 0 3px var(--picker-primary-lighter);
        outline: none;
      }
      .indicator-wrapper {
        border-bottom: none;
        margin-bottom: 0.5rem;
      }
      .indicator {
        background: var(--picker-primary);
        border-radius: 9999px;
      }
      .tabpanel {
        background: var(--picker-shade);
        border-radius: 0.75rem;
      }
      .favorites {
        border-top: none;
        margin-top: 0.5rem;
      }
    `.replace(/\s+/g, ' ');
		return style;
	};
</script>

<div bind:this={containerElement} />

<style lang="postcss" global>
	emoji-picker {
		--picker-bg: white;
		--picker-shade: rgba(243, 244, 246);
		--picker-color: black;
		--picker-primary: var(--primary);
		--picker-primary-lighter: var(--primary-lighter);
		--button-hover-background: rgba(243, 244, 246);
		--button-active-background: rgba(243, 244, 246);
		--picker-shadow: 0px 4px 18px -1px rgb(0 0 0 / 10%), 0px 2px 4px -1px rgb(0 0 0 / 6%);
	}

	.dark emoji-picker {
		--picker-bg: rgba(31, 41, 55, 1);
		--picker-shade: rgba(55, 65, 81);
		--picker-color: white;
		--button-hover-background: rgba(55, 65, 81);
		--button-active-background: rgba(55, 65, 81);
	}
</style>
