<script>
import Tooltip from "../../atoms/Tooltip.svelte";
export let items, event;
</script>
<style>
.toolbar {
  display: flex;
  position: absolute;
  right: 1rem;
  top: -16px;

  border: solid var(--bg-misc) 1px;
  border-radius: 4px;
  background: var(--bg-content);
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
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.button:hover {
  background: var(--color-gray);
  color: var(--fg-notice);
}

.button:active {
  padding-top: 1px;
}
</style>
<div class="toolbar">
  {#each items as item}
  <Tooltip tip={item.name}>
    <div class="button icon" style:color={item.color} on:click={() => item.clicked(event)}>{item.icon}</div>
  </Tooltip>
  {/each}
</div>