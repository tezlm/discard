<script>
import Tooltip from "./Tooltip.svelte";
export let items, event;

const handleEvent = (item) => (e) => {
  e.stopImmediatePropagation();
  item.clicked(event);
};
</script>
<style>
.toolbar {
  display: flex;
  border: solid var(--bg-misc) 1px;
  border-radius: 4px;
  background: var(--bg-content);
  overflow: hidden;
  user-select: none;
}

.toolbar:hover {  
  box-shadow: var(--shadow-popup);
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--fg-light);
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.button:hover {
  background: var(--color-gray);
  color: var(--fg-notice);
}

.button:active {
  padding-top: 2px;
}
</style>
<div class="toolbar">
  {#each items as item}
  <Tooltip tip={item.name}>
    {#if item.color}
      <div class="button icon" style:color={item.color} on:click={handleEvent(item)}>{item.icon}</div>
    {:else}
      <div class="button icon" on:click={handleEvent(item)}>{item.icon}</div>
    {/if}
  </Tooltip>
  {/each}
</div>