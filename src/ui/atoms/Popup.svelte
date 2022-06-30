<script>
import { quadOut } from 'svelte/easing';
export let show = false, title = "";

function card(node) {
  return {
    duration: 150,
    easing: quadOut,
    css: t => `opacity: ${t}; transform: scale(${Math.min(t * 1.3, 1.01)})`,
  }
}

function opacity(node) {
  return {
    duration: 300,
    css: t => `opacity: ${t}`,
  }
}

function handleKeyDown(e) {
  if (e.key === "Escape") closePopup();
}

function closePopup() {
  show = false;
  document.removeEventListener("keydown", handleKeyDown);
}

document.addEventListener("keydown", handleKeyDown);
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
  background: #000000bb;
  z-index: 1234;
}

.card {
  width: 480px;
  min-height: 240px;
  padding: 16px;
  border-radius: 5px;
  background: var(--bg-content);
  color: var(--fg-content);
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  z-index: 5678;
}

.header {
  display: flex;
  margin-bottom: 1em;
  justify-content: space-between;
}

.header > div {
  font-size: 24px;
  cursor: pointer;
}
</style>
{#if show}
<div class="background" on:click={closePopup} transition:opacity>
  <div class="card" on:click={e => e.stopPropagation()} transition:card>
    {#if title}
    <div class="header">
      <h2><b>{title}</b></h2>
      <div on:click={closePopup}>x</div>
    </div>
    {/if}
    <slot></slot>
  </div>
</div>
{/if}
