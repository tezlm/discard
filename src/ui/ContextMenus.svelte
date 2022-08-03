<script>
import Context from "./atoms/Context.svelte";
let context = state.context;
let menuEl;
let x, y;

function closeMenu() {
  if ($context.items) state.context.set({});
}

$: queueMicrotask(() => {
  if (!menuEl) return;
  const rect = menuEl.getBoundingClientRect();
  x = Math.min(Math.max($context.x, 8), window.innerWidth  - rect.width  - 8);
  y = Math.min(Math.max($context.y, 8), window.innerHeight - rect.height - 8);  
});
</script>
<style>
.menu {
  position: fixed;
  z-index: 10;
}
</style>
<div class="menu" bind:this={menuEl} style:left="{x}px" style:top="{y}px">
  {#if $context.items}
  <Context items={$context.items} />
  {/if}
</div>
<svelte:window on:click={closeMenu} on:contextmenu={closeMenu} />
