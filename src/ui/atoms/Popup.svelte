<script>
// should only be used in src/Popups.svelte
import { quadOut } from 'svelte/easing';
export let raw = false;
let current = state.popup;

function card() {
  return {
    duration: 200,
    easing: quadOut,
    css: t => `opacity: ${t}; transform: scale(${Math.min(t * 1.1, 1.01)})`,
  }
}

function opacity() {
  return {
    duration: 300,
    css: t => `opacity: ${t}`,
  }
}
</script>
<style>
.background {
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000d8;
  z-index: 999;
}

.card {
  display: flex;
  flex-direction: column;

  position: relative;
  min-width: 440px;
  min-height: 200px;
  border-radius: 5px;
  background: var(--bg-content);
  color: var(--fg-content);
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  z-index: 999;
}

.raw {
  min-width: 0;
  min-height: 0;
  border-radius: 0;
  background: transparent;
}

.header {
  padding: 16px;
}

.content {
  padding: 4px 16px 16px;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: end;

  background: var(--bg-misc);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 16px;
}
</style>
<div class="background" on:click={() => state.popup.set({ ...$current, id: null })} transition:opacity>
  <div class="card" on:click={e => e.stopPropagation()} class:raw transition:card>
    {#if raw}
      <slot name="content"></slot>
    {:else}
      {#if $$slots.header}
      <div class="header">
        <slot name="header"></slot>
      </div>
      {/if}
      <div class="content">
        <slot name="content"></slot>
      </div>
      {#if $$slots.footer}
      <div class="footer">
        <slot name="footer"></slot>
      </div>
      {/if}
    {/if}
  </div>
</div>
