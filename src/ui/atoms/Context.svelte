<script>
export let items = [];
export let width = 180;
export let x = 10;
export let y = 10;
let hovered;
// TODO: close context menu on outside click
</script>
<style>
.menu {
  position: fixed;
  left: 10%;
  padding: 6px 8px;
  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
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
</style>
<div
  class="menu"
  style:width={width + "px"}
  style:left={x + "px"}
  style:top={y + "px"}
>
  {#each items as item}
    {#if item}
      <div
        class="item"
        style:color={item.color}
        on:click={item.clicked}
        on:mouseover={() => hovered = item}
        on:focus={() => hovered = item}
        on:mouseout={() => hovered = null}
        on:blur={() => hovered = null}
      >
        {item.label}
        {#if item.submenu}
        <div class="icon">navigate_next</div>
        {/if}
      </div>
      {#if item.submenu && hovered === item}
        <svelte:self
          items={item.submenu}
          x={x + width + 4}
          y={y}
          on:mouseover={() => hovered = item}
          on:focus={() => hovered = item}
        />
      {/if}
    {:else}
      <div class="spacer"></div>
    {/if}
  {/each}
</div>
