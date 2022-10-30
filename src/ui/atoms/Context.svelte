<script>
import { tick } from "svelte";
import { fastclick } from "../../util/use";
export let items = [];
export let width = null;
export let x;
export let y;
let menuEl;

let box = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

function calcBounds(el, x, y) {
  const rect = el.getBoundingClientRect();
  return {
    x: Math.min(Math.max(x, 8), window.innerWidth - rect.width - 8),
    y: Math.min(Math.max(y, 8), window.innerHeight - rect.height - 8),
    width: rect.width,
    height: rect.height,
  };
}

$: if (menuEl && items) box = calcBounds(menuEl, x, y);
$: right = box.width * 2 + box.x > window.innerWidth;
$: css = `top: ${box.y}px; left: ${box.x}px`;

function handleClick(item, e) {
  item.clicked(e);
  state.context.set({});
}
</script>
<style>
.menu {
  position: fixed;
  left: 10%;
  padding: 6px 8px;
  min-width: 180px;
  max-width: 240px;
  max-height: calc(100vh - 16px);
  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  overflow: visible !important;
}

.item {
  display: flex;
  position: relative;
  padding: 6px 8px;
  margin: 2px 0;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 2px;
  white-space: nowrap;
  cursor: pointer;
}

.item:hover {
  background: var(--color-accent);
  color: var(--fg-notice) !important;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  padding-left: 8px;
  margin-left: auto;
  transform: scale(1.2);
}

.spacer {
  height: 1px;
  width: 100%;
  margin: 4px auto;
  background: var(--bg-misc);
}

.submenu {
  position: absolute;
  width: calc(100% + 32px);
  height: calc(100% + 8px);
  top: -4px;
  left: -16px;
  visibility: hidden;
}

.item:hover > .submenu {
  visibility: visible;
}
</style>
<div class="menu scroll" style={css} style:width={width + "px"} bind:this={menuEl}>
{#each items as item}
  {#if item}
    {#if item.component}
      <div on:click|stopPropagation>
        <svelte:component this={item.component} />
      </div>
    {:else}
      <div
        class="item"
        style:color={item.color ?? "var(--fg-interactive)"}
        use:fastclick
        on:fastclick={e => handleClick(item, e)}
      >
        <div class="label">
          {item.label}
        </div>
        {#if item.icon}
        <div class="icon">{item.icon}</div>
        {/if}
        {#if item.submenu}
        {#if !item.icon}
        <div class="icon">navigate_next</div>
        {/if}
        <div class="submenu" bind:this={item.element}>
          {#await tick().then(() => box) then box}
          <svelte:self
            items={item.submenu}
            x={right ? (box.x - box.width - 4) : (box.x + box.width + 4)}
            y={(item.element?.getBoundingClientRect().y ?? 4) - 4}
          />
          {/await}
        </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="spacer"></div>
  {/if}
{/each}
</div>
