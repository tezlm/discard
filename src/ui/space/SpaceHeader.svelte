<script>
import { quadOut } from "svelte/easing";
import { roomContext } from "../../util/context";
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
  state.popup.set({ id, type: "space", ...opts }); 
}

function getHomeContextMenu() {
  return [
    { label: "Create Room",  icon: "tag",    clicked: () => state.popup.set({ id: "create", type: "room" }) },
    { label: "Create Space", icon: "folder", clicked: () => state.popup.set({ id: "create", type: "space" }) },
	  { label: "Join",         icon: "add",    clicked: () => state.popup.set({ id: "join" }) },
    null,
	  { label: "Settings", clicked: () => state.scene.set("user-settings"), icon: "settings" },
  ];
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

.color-nitor {
  color: #ff73fa;
}
</style>
<div class="header" on:click={() => showMenu = !showMenu}  on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: $focusedSpace ? roomContext($focusedSpace) : getHomeContextMenu(), x: e.clientX, y: e.clientY })}>
  <span>{$focusedSpace ? $focusedSpace?.name ?? "unknown" : "Home"}</span>
  {#if showMenu}
  {#if $focusedSpace}
  <div class="menu" transition:zoomIn>
      {#if $focusedSpace.power.me >= ($focusedSpace.power.invite ?? 0) || $focusedSpace.joinRule === "public"}
      <div class="item" on:click={() => showPopup("invite", { room: $focusedSpace })}><span class="color-accent">Invite People</span></div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => { state.selectedRoom.set($focusedSpace); state.scene.set("space-settings") }}>Space Settings</div>
      <div class="item" on:click={todo}>Notification Settings</div>
      <div class="spacer"></div>
      {#if $focusedSpace.power.me >= $focusedSpace.power.forState("m.space.child")}
      <div class="item" on:click={() => showPopup("create", { type: "room", parent: $focusedSpace })}>Create Room</div>
      <div class="item" on:click={() => showPopup("create", { type: "space", parent: $focusedSpace })}>Create Subspace</div>
      <div class="item" on:click={() => showPopup("addexisting", { parent: $focusedSpace })}>Add Existing Room</div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => showPopup("leave", { room: $focusedSpace })}><span class="color-red">Leave Space</span></div>
  </div>
  {:else}
  <div class="menu" transition:zoomIn>
      <div class="item" on:click={() => showPopup("create", { type: "room" })}>Create Room</div>
      <div class="item" on:click={() => showPopup("create", { type: "space" })}>Create Space</div>
      <div class="item" on:click={() => showPopup("join")}>Join</div>
      <div class="spacer"></div>
      <div class="item" on:click={() => state.scene.set("user-settings") }>Settings</div>
  </div>
  {/if}
  {/if}
</div>
