<script>
import Emoji from "../../molecules/Emoji.svelte";
import twemoji from "twemoji";
export let picked;
export let show = false;

function handleClick(e) {
  e.stopImmediatePropagation();
  show = !show;
}

function handlePick(val, keep) {
  if (val) picked(val, keep);
  if (!keep) show = false;
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

.emoji .wrapper {
  position: absolute;
  bottom: calc(56px);
  right: 0;
  pointer-events: all;
}
</style>
<div class="emoji">
  <div class="button" on:click={handleClick}>
    <div class="icon" class:shown={show}>
      {@html twemoji.parse("😀", {
        folder: "svg",
        ext: ".svg",
      })}
    </div>
  </div>
  {#if show}
  <div class="wrapper">
    <Emoji selected={handlePick} />
  </div>
  {/if}
</div>
<svelte:window on:click={() => show = false} />
