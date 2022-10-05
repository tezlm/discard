<script>
import Emoji from "./molecules/Emoji.svelte";
let popout = state.popout;
let windowHeight, windowWidth;
let emojiEl;

// TODO: autofocus emoji picker input

function getPosition(popout, element) {
  const rect = element?.getBoundingClientRect() ?? { width: 0, height: 0 };
  const clampH = (h) => Math.min(Math.max(h, 8), windowHeight - rect.height - 8);
  const clampW = (w) => Math.min(Math.max(w, 8), windowWidth - rect.width - 8);
  
  let css = "";
  if (popout.top)    css += `top: ${clampH(popout.top)}px;`;
  if (popout.right)  css += `right: ${clampW(popout.right)}px;`;
  if (popout.left)   css += `left: ${clampW(popout.left)}px;`;
  if (popout.bottom) css += `bottom: ${clampH(popout.bottom)}px;`;
  return css;
}
</script>
<style>
.emoji {
  visibility: hidden;
  pointer-events: auto;
  position: fixed;
  transform: translateX(0);
}

.animate-right {
  animation: fly-right 150ms ease-out;
}

.animate-left {
  animation: fly-left 150ms ease-out;
}

.animate-top {
  animation: fly-bottom 150ms ease-out;
}

@keyframes fly-right {
  from { opacity: 0.5; transform: translateX(15px) }
  to   { opacity: 1;   transform: translateX(0) }
}

@keyframes fly-left {
  from { opacity: 0.5; transform: translateX(-15px) }
  to   { opacity: 1;   transform: translateX(0) }
}

@keyframes fly-top {
  from { opacity: 0.5; transform: translateY(-15px) }
  to   { opacity: 1;   transform: translateY(0) }
}
</style>
<div
  class="emoji"
  class:animate-right={$popout.animate === "right"}
  class:animate-left={$popout.animate === "left"}
  class:animate-top={$popout.animate === "top"}
  style:visibility={$popout.id === "emoji" ? "visible" : "hidden"}
  style={getPosition($popout, emojiEl)}
  bind:this={emojiEl}
>
  <Emoji selected={$popout.selected} />
</div>
<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />
