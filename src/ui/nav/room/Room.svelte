<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
export let room;
let focusedRoom = state.focusedRoom;
$: focused= $focusedRoom?.roomId === room.roomId;

function isRead(room) {
	const timeline = state.roomTimelines.get(room.roomId).live;
	if (!timeline.length) return true;
	const lastMessage = timeline.at(-1);
	const readMessage = getLastMessage(timeline, room.readEvent);
	if (!readMessage) return false;
	return getLastMessage(timeline, room.readEvent) === lastMessage;

	function getLastMessage(timeline, fromEvent) {
		const index = timeline.lastIndexOf(fromEvent);
		if (index === -1) return null;
		for (let i = index; i >= 0; i--) {
			const event = state.events.get(timeline[i]);
			if (event.special !== "redacted") return event.eventId;
		}
		return null;
	}
}

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
}

function openSettings(room) {
	return () => {
		state.selectedRoom.set(room);
		state.scene.set("room-settings");	
	};
}
</script>
<style>
.room-icon {
	position: absolute;
	color: var(--fg-dim); 
	font-size: 20px;
	margin-left: -2px;
	padding: 6px 0;
}

.name {
	margin-left: 1.5em;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 6px 0;
}

.spacer {
	margin-left: auto;
	min-width: 4px;
}

.settings {
	line-height: 1;
}

.settings .icon {
	color: var(--fg-dim);
	font-size: 16px;
	padding: 6px 2px;
}

.settings .icon:hover {
	color: var(--fg-light);
}

.settings .icon:active {
	transform: translateY(1px);
}

.pings {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 16px;
	min-width: 16px;
	margin-right: 4px;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 50%;
}

.hover.focused {
	display: block;
}
</style>
<Item
	{focused}
	unread={!isRead(room)}
	clicked={() => actions._rooms.focus(room)}
	getContext={() => getContextMenu(room)}
>
	<!-- TODO: get and use better room icon -->
	<div class="icon room-icon" style="font-family: var(--font-display)">#</div>
	<div class="name">{room.name.toLowerCase().replace(/ /g, "-").replace(/^#/, "")}</div>
	<div class="spacer"></div>
	{#if room.pings}<div class="pings">{room.pings}</div>{/if}
	{#if room.power.me >= room.power.getBase("invite") || room.joinRule === "public"}
	<div class="settings hover" class:focused on:click|stopPropagation={(e) => state.popup.set({ id: "invite", type: "room", room })}>
		<Tooltip tip="Send Invite">
			<span class="icon">person_add</span>
		</Tooltip>
	</div>
	{/if}
	<div class="settings hover" class:focused on:click|stopPropagation={openSettings(room)}>
		<Tooltip tip="Edit Room">
			<span class="icon">settings</span>
		</Tooltip>
	</div>
	<div style="width: 4px"></div>
</Item>