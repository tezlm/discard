<script>
// in the future this wont exist (wrapper instead)
// TODO: close context menu on outside click
export let toplevel = true;

export let items = [];
export let width = 180;
export let x = 10;
export let y = 10;
</script>
<style>
.menu {
  left: 10%;
  padding: 6px 8px;
  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  z-index: 1;
}

.item {
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--fg-interactive);
  font-size: 14px;
  font-weight: 500;
  min-height: 32px;
  margin: 2px 0;
}

.item:hover {
  background: var(--color-blue);
  color: var(--fg-notice) !important;
}

.icon {
  float: right;
}

.spacer {
  height: 1px;
  width: 100%;
  margin: 5px auto;
  background: var(--bg-misc);
}

.submenu {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  top: -8px;
  left: calc(100%);
  padding-left: 12px;
}

.item:hover > .submenu {
  visibility: visible;
}
</style>
<div
  class="menu"
  style:position={toplevel && "fixed"}
  style:width={width + "px"}
  style:left={toplevel && x + "px"}
  style:top={toplevel && y + "px"}
>
{#each items as item}
  {#if item}
    <div
      class="item"
      style:color={item.color}
      on:click={item.clicked}
      style="position: relative"
    >
      {item.label}
      {#if item.submenu}
      <div class="icon">navigate_next</div>
      <div class="submenu">
        <svelte:self items={item.submenu} toplevel={false} />
      </div>
      {:else if item.icon}
      <div class="icon">{item.icon}</div>
      {/if}
    </div>
  {:else}
    <div class="spacer"></div>
  {/if}
{/each}
</div>
