<script>
// should only be used in src/Popups.svelte
import { quadOut } from 'svelte/easing';
export let raw = false;
export let showClose = false;
let current = state.popup;
let { settings, context } = state;

function closePopup() {
  $current.cancel && $current.cancel();
  $context = {};
  state.popup.set({ ...$current, id: null });
}

function card() {
  return {
    duration: 200,
    easing: quadOut,
    css: t => $settings.get("reducemotion") ? `opacity: ${t}` : `opacity: ${t}; transform: scale(${Math.min(t * 1.1, 1.01)})`,
  }
}

function opacity() {
  return {
    duration: 250,
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
  z-index: 10;
}

.card {
  display: flex;
  flex-direction: column;

  position: relative;
  min-width: 440px;
  min-height: 200px;
  max-height: calc(100vh - 16px);
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

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  font-weight: normal;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color 0.4s;
}
</style>
<div
  class="background"
  on:mousedown|stopPropagation={closePopup}
  on:click|stopPropagation
  transition:opacity
>
  <div
    class="card"
    class:raw
    on:mousedown|stopPropagation
    transition:card
    role="dialog"
    aria-modal="true"
  >
    {#if showClose}
      <button class="icon close" on:click={closePopup}>close</button>
    {/if}
    {#if raw}
      <slot name="content"></slot>
    {:else}
      {#if $$slots.header}
      <div class="header">
        <slot name="header"></slot>
      </div>
      {/if}
      <div class="content scroll">
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
