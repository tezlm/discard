<script>
export let value;
export let max;
export let tooltipify;
export let changed;
export let vertical = false;
export let moving = false;
let select = 0;
let wrapperEl;

function handleClick(e) {
  moving = true;
  handleMove(e);
}

function handleBlur() {
  moving = false;
}

function handleMove(e) {
  if (!moving) return;
  const rect = wrapperEl.getBoundingClientRect();
  const cursor = vertical ? rect.height - (e.clientY - rect.top) : e.clientX - rect.left;
  const offset = vertical ? rect.height : rect.width;
  const pos = Math.min(Math.max(cursor, 8), offset - 8) - 8;
  select = max * (pos / (offset - 16));
  if (e.buttons === 1) changed(select);
}
</script>
<style>
.wrapper {
  flex: 1;
  position: relative;
  padding: 8px;
  cursor: pointer;
}

.wrapper .bar,
.wrapper .select,
.wrapper .progress {
  position: absolute;
  border-radius: 6px;
}

.wrapper:not(.vertical) .bar,
.wrapper:not(.vertical) .select,
.wrapper:not(.vertical) .progress {
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  height: 6px; 
}

.wrapper.vertical .bar,
.wrapper.vertical .select,
.wrapper.vertical .progress {
  left: 50%;
  bottom: 0;
  height: 100%;
  transform: translateX(-50%);
  width: 6px; 
}

.wrapper .duration {
  background: var(--color-gray-light);
}

.wrapper .progress {
  background: var(--color-accent);
}

.wrapper .select {
  background: var(--fg-muted);
  opacity: 0;
  transition: opacity .1s;
}

.wrapper .thumb {
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: var(--shadow-popup);
  filter: brightness(.8);
  transform: translate(-50%, -50%);
  transition: width .2s, height .2s;
  cursor: grab;
}

.wrapper:not(.vertical) .thumb {
  top: 50%;
}

.wrapper.vertical .thumb {
  left: 50%;
  transform: translate(-50%, 50%);
}

.wrapper:hover .thumb, .wrapper.moving .thumb {
  width: 10px;
  height: 10px;
}

.wrapper .tooltip {
  position: absolute;
  top: -6px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 700;
  background: var(--bg-tooltip);
  transform: translate(-50%, -100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity .2s;
}

.tooltip::after {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border: solid transparent 6px;
  border-top: solid var(--bg-tooltip) 6px;
  transform: translate(-50%, 0%);
  top: 100%;
  left: 50%;
}

.wrapper:hover .tooltip,
.wrapper:hover .select {
  opacity: 1;
}
</style>
<div
  class="wrapper"
  class:vertical
  class:moving
  bind:this={wrapperEl}
  on:mousedown={handleClick}
  on:mousemove={handleMove}
>
  <div style="position: relative; height: 100%">
    {#if vertical}
      <div class="bar duration"></div>
      <div class="bar select" style:height={(select * 100 / max) + "%"}></div>
      <div class="bar progress" style:height={(value * 100 / max) + "%"}></div>
      <div class="thumb" style:bottom={(value * 100 / max) + "%"}></div>
      {#if tooltipify}
      <div class="tooltip" style:bottom={(select * 100 / max) + "%"}>{tooltipify(select)}</div>
      {/if}
    {:else}
      <div class="bar duration"></div>
      <div class="bar select" style:width={(select * 100 / max) + "%"}></div>
      <div class="bar progress" style:width={(value * 100 / max) + "%"}></div>
      <div class="thumb" style:left={(value * 100 / max) + "%"}></div>
      {#if tooltipify}
      <div class="tooltip" style:left={(select * 100 / max) + "%"}>{tooltipify(select)}</div>
      {/if}
    {/if}
    </div>
</div>
<svelte:window on:mousemove={handleMove} on:mouseup={handleBlur} />
