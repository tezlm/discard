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
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 1rem;
  height: 48px;

  background: var(--bg-rooms-members);
  font-weight: 700;
  box-shadow: var(--shadow-header);
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

  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  z-index: 10;
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
  background: var(--color-blue);
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
  <span>{$focusedSpace ? $focusedSpace?.name ?? "unknown" : "Home"}</span>
  {#if $focusedSpace && showMenu}
  <div class="menu" transition:zoomIn>
      <div class="item" on:click={() => showPopup("invite")}><span class="color-accent">Invite People</span></div>
      <div class="spacer"></div>
      <div class="item" on:click={() => { state.selectedRoom.set($focusedSpace); state.scene.set("space-settings") }}>Space Settings</div>
      <div class="spacer"></div>
      <div class="item" on:click={() => showPopup("create", { type: "room", confirm: todo })}>Create Room</div>
      <div class="item" on:click={() => showPopup("create", { confirm: todo })}>Create Subspace</div>
      <div class="item" on:click={todo}>Add Existing Room</div>
      <div class="spacer"></div>
      <div class="item" on:click={() => showPopup("leave", { confirm: () => queueMicrotask(todo) })}><span class="color-red">Leave Space</span></div>
  </div>
  {/if}
</div>
