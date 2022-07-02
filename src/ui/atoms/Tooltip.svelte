<script>
export let tip = "", position = "up", style = "", color;
let x = 0, y = 0, visible = false;

function show() {
  let rect = element.getClientRects()[0];
  x = rect.x + rect.width / 2;
  y = rect.y;
  visible = true;
}

function hide() {
  visible = false;
}
</script>
<style>
.wrapper {
  position: relative;
  display: inline-block;
}

.wrapper:hover > .tooltip-wrapper {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.tooltip-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%) scale(0.9);
  pointer-events: none;
  opacity: 0;
  z-index: 10;
  transition: all 50ms;
}

.tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  
  font-size: .9rem;
  font-weight: 500;
  white-space: nowrap;
  background: var(--bg-tooltip);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);

  opacity: 1;
  z-index: 10;
  transition: all 50ms;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  height: 0;
  width: 0;
  border: solid transparent 6px;
}

.tooltip.up    { top: 0; transform: translate(-50%, calc(-100% - 10px)) }
.tooltip.down  { top: 100%; transform: translate(-50%, calc(10px)) }
.tooltip.left  { left: 0; transform: translate(calc(-100% - 10px), -50%) }
.tooltip.right { left: 100%; transform: translate(10px, -50%) }
.tooltip.down::after  { border-bottom: solid var(--bg-tooltip) 6px; transform: translate(-50%, -100%); top: 0 }
.tooltip.up::after    { border-top: solid var(--bg-tooltip) 6px;    transform: translate(-50%, 0%); top: 100% }
.tooltip.left::after  { border-left: solid var(--bg-tooltip) 6px;   transform: translate(0, -50%); top: 50%; left: 100% }
.tooltip.right::after { border-right: solid var(--bg-tooltip) 6px;  transform: translate(-100%, -50%); top: 50%; left: 0 }
</style>
<div class="wrapper" style={color ? `--bg-tooltip: ${color}; ${style}` : style}>
  <div class="tooltip-wrapper">
    <div class="tooltip {position}">
      {#if $$slots.tip}
      <slot name="tip" />
      {:else}
      {tip}
      {/if}
    </div>
  </div>
  <slot />
</div>
