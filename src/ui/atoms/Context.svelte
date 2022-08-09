<script>
export let items = [];
export let width;
let menuEl;
let right = false;

function tooRight(menuEl) {
  if (!menuEl) return;
  const rect = menuEl.getBoundingClientRect();
  return rect.width * 2 + rect.left > window.innerWidth;
}

$: if (items) setTimeout(() => right = tooRight(menuEl));
</script>
<style>
.menu {
  left: 10%;
  padding: 6px 8px;
  min-width: 180px;
  max-width: 240px;
  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  z-index: 1;
}

.item {
  display: flex;
  position: relative;
  padding: 6px 8px;
  margin: 2px 0;
  height: 32px;
  color: var(--fg-interactive);
  font-size: 14px;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
}

.item:hover {
  background: var(--color-blue);
  color: var(--fg-notice) !important;
}

.icon {
  padding-left: 8px;
  margin-left: auto;
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
  padding: 0 12px;
}

.submenu:not(.right) {
  left: calc(100%);
}

.submenu.right {
  right: calc(100%);
}

.item:hover > .submenu {
  visibility: visible;
}
</style>
<div class="menu" style:width={width + "px"} bind:this={menuEl}>
{#each items as item}
  {#if item}
    <div
      class="item"
      style:color={item.color}
      on:click={item.clicked}
    >
      {#if item.component}
        <svelte:component this={item.component} />
      {:else}
        {item.label}
        {#if item.submenu}
        <div class="icon">navigate_next</div>
        <div class="submenu" class:right>
          <svelte:self items={item.submenu} />
        </div>
        {:else if item.icon}
        <div class="icon">{item.icon}</div>
        {/if}
      {/if}
      </div>
  {:else}
    <div class="spacer"></div>
  {/if}
{/each}
</div>
