<script>
export let items = [];
export let width = null;
let menuEl;
let right = false;

// FIXME: submenu can exist outside of window

function tooRight(menuEl) {
  if (!menuEl) return;
  const rect = menuEl.getBoundingClientRect();
  return rect.width * 2 + rect.left > window.innerWidth;
}

function handleClick(item, e) {
  item.clicked(e);
  state.context.set({});
  e.stopPropagation();
}

$: if (items) setTimeout(() => right = tooRight(menuEl));
</script>
<style>
.menu {
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
  position: absolute;
  top: -8px;
  padding: 0 12px;
  visibility: hidden;
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
<div class="menu scroll" style:width={width + "px"} bind:this={menuEl}>
{#each items as item}
  {#if item}
    {#if item.component}
      <div on:click={e => e.stopPropagation()}>
        <svelte:component this={item.component} />
      </div>
    {:else}
      <div
        class="item"
        style:color={item.color ?? "var(--fg-interactive)"}
        on:click={e => handleClick(item, e)}
      >
        {item.label}
        {#if item.icon}
        <div class="icon">{item.icon}</div>
        {/if}
        {#if item.submenu}
        {#if !item.icon}
        <div class="icon">navigate_next</div>
        {/if}
        <div class="submenu" class:right>
          <svelte:self items={item.submenu} />
        </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="spacer"></div>
  {/if}
{/each}
</div>
