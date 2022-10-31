<script>
import Emoji from "./molecules/Emoji.svelte";
import PinnedMessages from "./molecules/PinnedMessages.svelte";
import User from "./molecules/User.svelte";
let { popout, settings } = state;
let windowHeight, windowWidth;
let emojiEl, pinnedEl, memberEl;
let loadedEmoji = false;
// TODO: autofocus emoji picker input + clear on open

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

$: if ($popout.id === "emoji") loadedEmoji = true;
</script>
<style>
.popout {
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
  animation: fly-top 150ms ease-out;
}

.animate-bottom {
  animation: fly-bottom 150ms ease-out;
}

.reducemotion {
  animation: none;
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

@keyframes fly-bottom {
  from { opacity: 0.5; transform: translateY(15px) }
  to   { opacity: 1;   transform: translateY(0) }
}
</style>
{#if loadedEmoji}
<div
  class="popout"
  class:reducemotion={$settings.get("reducemotion")}
  class:animate-right={$popout.animate === "right"}
  class:animate-left={$popout.animate === "left"}
  class:animate-top={$popout.animate === "top"}
  class:animate-bottom={$popout.animate === "bottom"}
  style:visibility={$popout.id === "emoji" ? "visible" : "hidden"}
  style={getPosition($popout, emojiEl)}
  on:mousedown|stopPropagation
  bind:this={emojiEl}
>
  <Emoji selected={$popout.selected} />
</div>
{/if}
{#if $popout.id === "pinned"}
<div
  class="popout"
  class:reducemotion={$settings.get("reducemotion")}
  class:animate-right={$popout.animate === "right"}
  class:animate-left={$popout.animate === "left"}
  class:animate-top={$popout.animate === "top"}
  class:animate-bottom={$popout.animate === "bottom"}
  style={getPosition($popout, pinnedEl)}
  on:mousedown|stopPropagation
  bind:this={pinnedEl}
>
  <PinnedMessages room={$popout.room}/>
</div>
{/if}
{#if $popout.id === "member"}
{#key $popout}
<div
  class="popout"
  class:reducemotion={$settings.get("reducemotion")}
  class:animate-right={$popout.animate === "right"}
  class:animate-left={$popout.animate === "left"}
  class:animate-top={$popout.animate === "top"}
  class:animate-bottom={$popout.animate === "bottom"}
  style={getPosition($popout, memberEl)}
  on:mousedown|stopPropagation
  bind:this={memberEl}
>
  <User member={$popout.member} />
</div>
{/key}
{/if}
<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} on:mousedown={() => $popout = { _owner: $popout._owner }} />
