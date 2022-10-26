<script>
import Context from "./atoms/Context.svelte";
let { context } = state;

function closeMenu() {
  if ($context.items) $context = {};
}
</script>
<div style="pointer-events: auto">
{#if $context.items}
<Context
  items={$context.items}
  width={$context.width}
  x={$context.x}
  y={$context.y}
/>
{/if}
</div>
<svelte:window on:contextmenu={closeMenu} />
