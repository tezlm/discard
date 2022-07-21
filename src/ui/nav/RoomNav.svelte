<script>
import Tooltip from "../atoms/Tooltip.svelte";
let focusedRoom = state.focusedRoom;
let navRooms = state.navRooms;

// TODO: handle muted rooms
// maybe clean up a bit?
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
			if (["m.room.message", "m.room.create"].includes(event.type) && event.special !== "redacted") return event.eventId;
		}
		return null;
	}
}
</script>
<style>
.nav {
	flex: 1;
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	width: 240px;
	display: flex;
	flex-direction: column;
	overflow: hidden scroll;
}

.nav > .spacer {
	margin-top: 16px;
}

.room {
	flex: 0;
	position: relative;
	white-space: nowrap;
}

.wrapper {
	display: flex;
	align-items: center;
	margin: 1px 8px;
	padding: 6px 2px 6px 10px;

	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
}

.room:hover .wrapper {
	background: rgba(79,84,92,0.4);
  color: var(--fg-light);
}

.room.focused .wrapper {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.room.unread .wrapper {
	color: var(--fg-content); 
}

.room.unread:not(.focused)::before {
	content: "\2b24";
	position: absolute;
	color: var(--fg-content);
	font-size: 8px;
	left: -4px;
	top: 12px;
}

.home::before {
	content: "";
}

.icon {
	position: absolute;
	color: var(--fg-dim); 
	font-size: 22px;
}

.name {
	margin-left: 1.5em;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wrapper > .spacer {
	margin-left: auto;
	min-width: 4px;
}

.settings {
	display: none;
	margin-right: 4px;
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

.room.focused .settings, .room:hover .settings {
	display: block;
}
</style>
	<div class="nav" tabindex=-1>
		<div class="spacer"></div>
	  <div
			class={$focusedRoom ? "room home" : "room home focused"}
			on:click={() => actions._rooms.focus(null)}>
			<div class="wrapper">Home</div>
		</div>
		<!-- {#each $spaces.get($focusedSpace?.roomId ?? "orphanRooms") as room} -->
		{#each $navRooms as room}
	  <div
			class="room"
			class:focused={$focusedRoom?.roomId === room.roomId}
			class:unread={!isRead(room)}
			on:click={() => actions._rooms.focus(room)}>
			<div class="wrapper">
				<div class="icon">#</div>
				<div class="name">{room.name.toLowerCase().replace(/ /g, "-")}</div>
				<div class="spacer"></div>
				{#if room.pings}<div class="pings">{room.pings}</div>{/if}
				{#if room.power.me >= room.power.getBase("invite") || room.joinRule === "public"}
				<div class="settings" on:click={(e) => { e.stopImmediatePropagation(); state.popup.set({ id: "invite", type: "room", room }) }}>
					<Tooltip tip="Send Invite">&#129730;</Tooltip>
				</div>
				{/if}
				<div class="settings" on:click={(e) => { e.stopImmediatePropagation(); state.selectedRoom.set(room); state.scene.set("room-settings") }}>
					<Tooltip tip="Edit Room">🔧</Tooltip>
				</div>
			</div>
		</div>
		{/each}
		<div class="spacer"></div>
	</div>
