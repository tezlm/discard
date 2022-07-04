<script>
import { quadOut } from 'svelte/easing';
let focusedSpace = state.focusedSpace;
let showMenu = false;

function zoomIn() {
  return {
    duration: 100,
    easing: quadOut,
    css: t => `transform: scale(${t})`,
  }
}

function showPopup(id, opts) {
  state.popup.set({ id, type: "space", room: $focusedSpace, ...opts }); 
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
  font-weight: 700;
  box-shadow: var(--shadow-header);
  z-index: 5;
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
}

.menu .item {
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--fg-interactive);
  font-size: 14px;
  font-weight: 500;
  min-height: 32px;
  margin: 2px 0;
}

.menu .item:hover {
  background: hsl(235,51.4%,52.4%);
  color: #fff;
}

.menu .item:hover > span {
  color: #fff;
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
      <div class="item" on:click={() => showPopup("invite")}><span class="color-accent">Invite People</span></div>
      <div class="spacer"></div>
      <div class="item" on:click={() => state.scene.set("space-settings")}>Space Settings</div>
      <div class="spacer"></div>
      <div class="item" on:click={() => showPopup("create", { type: "room" })}>Create Room</div>
      <div class="item" on:click={() => showPopup("create")}>Create Subspace</div>
      <div class="item" on:click={todo}>Add Existing Room</div>
      <div class="spacer"></div>
      <div class="item" on:click={() => showPopup("leave")}><span class="color-red">Leave Space</span></div>
  </div>
  {/if}
</div>
