<svelte:options immutable />
<script lang="ts">
export let tip = "";
export let position: "up" | "down" | "left" | "right" = "up";
export let style = "";
export let color = null;
let wrapperEl: HTMLDivElement, tooltipEl: HTMLDivElement;

function setPos() {
  if (!wrapperEl) return;
  const rect = wrapperEl.getBoundingClientRect();
  const offsetY = position === "up" ? 0
    : position === "down" ? rect.height
    : rect.height / 2;
  const offsetX = position === "left" ? 0
    : position === "right" ? rect.width
    : rect.width / 2;
  tooltipEl.style.top = (rect.top + offsetY) + "px";
  tooltipEl.style.left = (rect.left + offsetX) + "px";
}
</script>
<style>
.wrapper {
  position: relative;
  display: inline-block;
}

.wrapper:hover > .tooltip {
  opacity: 1;
}

.tooltip {
  position: fixed;
  padding: 8px 12px;
  opacity: 0;

  font-size: .9rem;
  font-weight: 500;
  background: var(--bg-tooltip);
  border-radius: 6px;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);

  z-index: 9999;
  pointer-events: none;
  user-select: none;
  transition: transform 50ms;
}

.tooltip::after {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border: solid transparent 6px;
}

.tooltip.up    { transform: translate(-50%, calc(-100% - 10px)) scale(0.9); transform-origin: bottom center; }
.tooltip.down  { transform: translate(-50%, calc(10px)) scale(0.9);         transform-origin: top center; }
.tooltip.left  { transform: translate(calc(-100% - 10px), -50%) scale(0.9); transform-origin: center right; }
.tooltip.right { transform: translate(10px, -50%) scale(0.9);               transform-origin: center left; }
.wrapper:hover > .tooltip.up    { transform: translate(-50%, calc(-100% - 10px)) scale(1) }
.wrapper:hover > .tooltip.down  { transform: translate(-50%, calc(10px)) scale(1) }
.wrapper:hover > .tooltip.left  { transform: translate(calc(-100% - 10px), -50%) scale(1) }
.wrapper:hover > .tooltip.right { transform: translate(10px, -50%) scale(1) }
.tooltip.down::after  { border-bottom: solid var(--bg-tooltip) 6px; transform: translate(-50%, -100%); top: 0;    left: 50% }
.tooltip.up::after    { border-top: solid var(--bg-tooltip) 6px;    transform: translate(-50%, 0%);    top: 100%; left: 50% }
.tooltip.left::after  { border-left: solid var(--bg-tooltip) 6px;   transform: translate(0, -50%);     top: 50%;  left: 100% }
.tooltip.right::after { border-right: solid var(--bg-tooltip) 6px;  transform: translate(-100%, -50%); top: 50%;  left: 0 }
</style>
<div
  class="wrapper"
  style={color ? `--bg-tooltip: ${color}; ${style}` : style}
  bind:this={wrapperEl}
  on:mouseover={setPos}
  on:focus={setPos}
  role="tooltip"
>
  <div class="tooltip {position}" bind:this={tooltipEl}>
    {#if $$slots.tip}
    <slot name="tip" />
    {:else}
    {tip}
    {/if}
  </div>
  <slot />
</div>
