<script>
import Popup from "../atoms/Popup.svelte";
import { quadOut } from 'svelte/easing';
let focusedSpace = state.focusedSpace;
let showMenu = false;

function zoomIn(node) {
  return {
    duration: 100,
    easing: quadOut,
    css: t => `transform: scale(${t})`,
  }
}
</script>
<style>
.header {
  background: var(--bg-rooms-members);

  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 1rem;
  height: 48px;
  box-shadow: var(--shadow-header);
	font-weight: bold;
  z-index: 1;
  cursor: pointer;
}

.menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  margin: 10px;
  padding: 6px 8px;

  transform-origin: top center;

  background: var(--bg-tooltip);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  z-index: 9999;
}

.menu .item {
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--fg-light);
  font-size: 14px;
  min-height: 32px;
  margin: 2px 0;
}

.menu .item:hover {
  background: var(--color-accent);
}

.menu .item:hover > span {
  color: var(--fg-content);
}

.menu .spacer {
  height: 1px;
  width: 196px;
  margin: 5px auto;
  background: var(--bg-misc);
}

.color-accent {
  color: var(--color-accent);
}

.color-red {
  color: var(--color-red);
}
</style>
<div class="header" on:click={() => showMenu = $focusedSpace && !showMenu}>
  <span>{$focusedSpace ? state.client.getRoom($focusedSpace).name : "Home"}</span>
  {#if $focusedSpace && showMenu}
  <div class="menu" transition:zoomIn>
      <div class="item"><span class="color-accent">Invite People</span></div>
      <div class="spacer"></div>
      <div class="item" on:click={() => state.scene.set("space-settings")}>Space Settings</div>
      <div class="spacer"></div>
      <div class="item">Create Room</div>
      <div class="item">Create Subspace</div>
      <div class="item">Add Existing Room</div>
      <div class="spacer"></div>
      <div class="item"><span class="color-red">Leave Space</span></div>
  </div>
  {/if}
</div>
