<script>
import Tooltip from "../../atoms/Tooltip.svelte";
export let items, event;
</script>
<style>
.toolbar {
  display: flex;
  position: absolute;
  right: 1rem;
  top: -8px;

  border: solid var(--bg-misc) 1px;
  border-radius: 4px;
  background: var(--bg-content);
}

.toolbar:hover {  
  box-shadow: var(--shadow-popup);
}

.button {
  width: 32px;
  height: 32px;
  padding: 6px;
  color: var(--fg-content);
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.button:hover {
  background: var(--color-gray);
}

.button:active {
  transform: translateY(1px);
}
</style>
<div class="toolbar">
  {#each items as item}
  <Tooltip tip={item.name}>
    <div class="button" on:click={() => item.clicked(event)}>{item.icon}</div>
  </Tooltip>
  {/each}
</div>