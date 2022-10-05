<script>
import twemoji from "twemoji";
export let picked;
export let show = false;
let wrapperEl;

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
.emoji {
  position: relative;
}

.emoji .button {
  padding: 11px 12px 0;
  height: 100%;
  pointer-events: all;
  cursor: pointer;
}

.emoji .button .icon {
  height: 22px;
  width: 22px;
  filter: grayscale(1);
  transition: all .2s ease-out;
}

.emoji:hover .button .icon, .emoji .icon.shown {
  filter: grayscale(0);
  transform: scale(1.2);
}
</style>
<div class="emoji">
  <div class="button" bind:this={wrapperEl} on:click={handleClick}>
    <div class="icon" class:shown={show}>
      {@html twemoji.parse("😀", {
        folder: "svg",
        ext: ".svg",
      })}
    </div>
  </div>
</div>
<svelte:window on:click={() => show = false} />
