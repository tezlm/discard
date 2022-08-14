<script>
import Tooltip from "../../atoms/Tooltip.svelte";
import Room from "./Room.svelte";
export let room;
let expanded = true;
$: rooms = state.spaces.get(room.roomId);

// TODO: persist `expanded`
// TODO: subspace-specific menu?

function getContextMenu(room) {
	return [
	  { label: "Mark As Read",  clicked: markRead, icon: "done" },
	  { label: "Notifications", clicked: todo, submenu: [
	    { label: "Default",      clicked: todo, icon: "radio_button_checked" },
	    { label: "All Messages", clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Mentions",     clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Nothing",      clicked: todo, icon: "radio_button_unchecked" },
	  ] },
	  null,
	  { label: "Settings", clicked: openSettings(room), icon: "settings" /* submenu: [
	    { label: "Foo", clicked: todo },
	    { label: "Bar", clicked: todo },
	    { label: "Baz", clicked: todo },
	  ]*/ },
	  null,
	  { label: "Invite",    clicked: () => state.popup.set({ id: "invite", type: "room", room }), icon: "person_add", color: "var(--color-accent)" },
	  { label: "Copy Link", clicked: copy(`https://matrix.to/#/${room.roomId}`), icon: "link" },
	  null,
	  { label: "Leave",   clicked: () => state.popup.set({ id: "leave", type: "room", room }), icon: "logout", color: "var(--color-red)" },
	  null,
	  { label: "Copy ID", clicked: copy(room.roomId), icon: "terminal" },
	  { label: "Dev Tools", clicked: () => state.popup.set({ id: "dev-room", room }) },
	];

	function markRead() {
	  const lastEvent = state.roomTimelines.get(room.roomId).live.at(-1);
	  state.log.debug(`mark ${lastEvent} as read`);
	  state.rooms.get(room.roomId).readEvent = lastEvent;
	  if (state.focusedRoomId === room.roomId) state.slice.set(state.roomSlices.get(room.roomId));
	  state.api.sendReceipt(room.roomId, lastEvent);
	}

	function copy(text) {
		return () => navigator.clipboard.writeText(text);
	}

  function openSettings(room) {
  	return () => {
  		state.selectedRoom.set(room);
  		state.scene.set("space-settings");	
  	};
  }
}
</script>
<style>
.category {
  display: flex;
	align-items: center;
  cursor: pointer;
}

.title {
  color: var(--fg-dim);
  margin-bottom: 0;
}

.chevron {
  color: var(--fg-dim);
  margin: 3px;
  font-size: 12px;
  transition: transform .2s;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.category:hover .title, .category:hover .chevron {
  color: var(--fg-content);
}

.add {
  color: var(--fg-muted);
  font-size: 22px;
}

.add:hover {
  color: var(--fg-content);
}
</style>
<div style="height: 14px"></div>
<div class="category" on:click={() => expanded = !expanded} on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: getContextMenu(room), x: e.clientX, y: e.clientY })}>
  <div class="icon chevron" class:expanded>chevron_right</div>
  <div class="title">{room.name}</div>
  <div style="flex: 1"></div>
  <Tooltip tip="Create Room">
    <div class="icon add" on:click|stopPropagation={() => state.popup.set({ id: "create", type: "room", parent: room })}>add</div>
  </Tooltip>
  <div style="width: 14px"></div>
</div>
{#if expanded}
{#each rooms as room}
<Room {room} />
{/each}
{/if}
