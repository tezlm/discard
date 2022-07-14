<script>
import Tooltip from "../atoms/Tooltip.svelte";
let focusedRoom = state.focusedRoom;
let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;
let rooms = state.rooms;

state.focusedRoom.subscribe(() => {
	rooms = state.rooms; // hacky svelte ;)
});

function getLastMessage(timeline) {
	for (let i = timeline.length - 1; i >= 0; i--) {
		if (timeline[i].getType() === "m.room.message" && !timeline[i].isRedacted()) return timeline[i];
	}
	return null;
}

function isRead(room) {
	return true; // TODO: fix
	const userId = state.client.getUserId();
	const eventId = getLastMessage(room.timeline)?.getId();
	if (!eventId) return true;
	return room.hasUserReadEvent(userId, eventId);
}

function getClasses(room) {
	const classes = ["room"];
	if (state.focusedRoomId === room.roomId) classes.push("selected");
	if (!isRead(room)) classes.push("unread");
	return classes;
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
	overflow-x: visible;
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
	padding: 6px 10px;

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

.room.selected .wrapper {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.room.unread .wrapper {
	color: var(--fg-content); 
}

.room.unread:not(.selected)::before {
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

.spacer {
	margin-top: 16px;
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

.settings {
	display: none;
	margin-left: auto;
}

.room.selected .settings, .room:hover .settings {
	display: block;
}
</style>
	<div class="nav" tabindex=-1>
		<div class="spacer"></div>
		{#if !$focusedSpace}
	  <div
			class={$focusedRoom ? "room home" : "room home selected"}
			on:click={() => actions._rooms.focus(null)}>
			<div class="wrapper">Home</div>
		</div>
		{/if}
		{#each $rooms.filter(i => $spaceMap.get($focusedSpace ?? "orphanRooms").includes(i.roomId)) as room}
	  <div
				class={getClasses(room).join(" ")}
				on:click={() => actions._rooms.focus(room)}>
				<div class="wrapper">
					<div class="icon">#</div>
					<div class="name">{room.name.toLowerCase().replace(/ /g, "-")}</div>
					<div class="settings" on:click={() => state.popup.set({ id: "invite", type: "room", room: $focusedRoom.roomId })}>
						<Tooltip tip="Send Invite">&#129730;</Tooltip>
					</div>
					<div class="settings" style="margin-left: 4px;" on:click={() => state.scene.set("room-settings")}>
						<Tooltip tip="Edit Room">🔧</Tooltip>
					</div>
				</div>
			</div>
		{/each}
		<div class="spacer"></div>
	</div>
