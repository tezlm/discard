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
  state.popup.set({ id, type: "space", ...opts }); 
}

// TODO: merge with SpaceNav
function getContextMenu(space) {
	return [
	  // { label: "Mark As Read",  clicked: markRead, icon: "done" },
	  { label: "Notifications", clicked: todo, submenu: [
	    { label: "Default",      clicked: todo, icon: "radio_button_checked" },
	    { label: "All Messages", clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Mentions",     clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Nothing",      clicked: todo, icon: "radio_button_unchecked" },
	  ] },
	  null,
	  { label: "Settings", clicked: openSettings, icon: "settings" /* submenu: [
	    { label: "Foo", clicked: todo },
	    { label: "Bar", clicked: todo },
	    { label: "Baz", clicked: todo },
	  ]*/ },
	  null,
	  { label: "Invite",    clicked: () => state.popup.set({ id: "invite", room: space }), icon: "person_add", color: "var(--color-accent)" },
	  { label: "Copy Link", clicked: copy(`https://matrix.to/#/${space.roomId}`), icon: "link" },
	  null,
	  { label: "Leave",   clicked: () => state.popup.set({ id: "leave", type: "space", room: space }), icon: "logout", color: "var(--color-red)" },
	  null,
	  { label: "Copy ID", clicked: copy(space.roomId), icon: "terminal" },
	];

	// function markRead() {
	//   const lastEvent = state.roomTimelines.get(room.roomId).live.at(-1);
	//   state.log.debug(`mark ${lastEvent} as read`);
	//   state.rooms.get(room.roomId).readEvent = lastEvent;
	//   state.slice.set(state.roomSlices.get(room.roomId));
	//   state.api.sendReceipt(room.roomId, lastEvent);
	// }

  function openSettings() {
  	state.selectedRoom.set(space);
  	state.scene.set("space-settings");
  }

	function copy(text) {
		return () => navigator.clipboard.writeText(text);
	}
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
<div class="header" on:click={() => showMenu = $focusedSpace && !showMenu}  on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: getContextMenu($focusedSpace), x: e.clientX, y: e.clientY })}>
  <span>{$focusedSpace ? $focusedSpace?.name ?? "unknown" : "Home"}</span>
  {#if $focusedSpace && showMenu}
  <div class="menu" transition:zoomIn>
      <div class="item" on:click={() => { state.selectedRoom.set($focusedSpace); state.scene.set("goose") }}><span class="color-nitor">Space Goose</span></div>
      <div class="spacer"></div>
      {#if $focusedSpace.power.me >= $focusedSpace.power.getBase("invite") || $focusedSpace.joinRule === "public"}
      <div class="item" on:click={() => showPopup("invite", { room: $focusedSpace })}><span class="color-accent">Invite People</span></div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => { state.selectedRoom.set($focusedSpace); state.scene.set("space-settings") }}>Space Settings</div>
      <div class="spacer"></div>
      {#if $focusedSpace.power.me >= $focusedSpace.power.getState("m.space.child")}
      <div class="item" on:click={() => showPopup("create", { type: "room", parent: $focusedSpace })}>Create Room</div>
      <div class="item" on:click={() => showPopup("create", { type: "space", parent: $focusedSpace })}>Create Subspace</div>
      <div class="item" on:click={todo}>Add Existing Room</div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => showPopup("leave", { room: $focusedSpace })}><span class="color-red">Leave Space</span></div>
  </div>
  {/if}
</div>
