<script>
import twemoji from "twemoji";
export let picked;
export let show = false;
let wrapperEl;

const emojis = ["😀", "🤨", "🥰", "🥳", "🥹", "😫", "🤬", "🤓", "🤮"];
let emoji = emojis[0];
const changeEmoji = () => emoji = emojis[Math.floor(Math.random() * emojis.length)];

function handleClick(e) {
  e.stopPropagation();
  show = !show;
}

$: if (show) {
  const rect = wrapperEl.getBoundingClientRect();
  state.popout.set({
    id: "emoji",
    animate: "top",
    bottom: 76,
    right: window.innerWidth - rect.right,
    selected(emoji, keepOpen) {
      if (emoji) picked(emoji, keepOpen);
      if (!keepOpen) show = false;
    },
  });
} else {
  state.popout.set({});
}
</script>
<style>
.wrapper {
  position: relative;
}

.wrapper .button {
  padding: 11px 12px 0;
  height: 100%;
  pointer-events: all;
  cursor: pointer;
}

.button :global(img.emoji) {
  height: auto;
  transform: none;
  margin-right: 0;
  
  height: 22px;
  width: 22px;
}

.button .icon {
  filter: grayscale(1);
  transition: all .2s ease-out;  
}

:is(.button:hover, .button.shown) :global(.icon) {
  filter: grayscale(0);
  transform: scale(1.2);
}
</style>
<div class="wrapper" on:mouseenter={changeEmoji} on:focus={changeEmoji}>
  <div class="button" bind:this={wrapperEl} on:click={handleClick} class:shown={show}>
    <div class="icon">
      {@html twemoji.parse(emoji, {
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        folder: "svg",
        ext: ".svg",
      })}
    </div>
  </div>
</div>
<svelte:window on:click={() => show = false} />
