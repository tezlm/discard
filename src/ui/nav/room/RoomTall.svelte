<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import { roomContext } from "../../../util/context";
export let room;
export let muted = false;
let focusedRoom = state.focusedRoom;
let dms = state.dms;
$: focused= $focusedRoom?.roomId === room.roomId;

// move dm status into the room object?
function getName(room) {
	if (!dms.has(room.roomId)) return room.name;
	const other = dms.get(room.roomId);
	return other.name ?? other.userId;
}

function getAvatar(room) {
	if (!dms.has(room.roomId)) return room.avatar;
	return dms.get(room.id).avatar;
}

function isRead(room) {
	if (muted) return true;

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

function openSettings(room) {
	return () => {
		state.selectedRoom.set(room);
		state.scene.set("room-settings");	
	};
}

function getIcon(room) {
	const type = room.getState("m.room.create")?.content.type;
	if (type === "org.eu.celery.room.media") return "image";
	if (type === "org.eu.celery.room.forum") return "message";
	if (type === "io.element.video") return "volume_up";
	if (dms.has(room.roomId)) return "person";
	if (!type) {
		// if ((room.power.users_default ?? 0)< room.power.getEvent("m.room.message")) {
		// 	return "campaign";
		// }
		return "tag";
	}
	return "help";
}
</script>
<style>
.avatar {
	padding: 5px 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.name {
	margin-left: 12px;
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
	{muted}
	unread={!isRead(room)}
	clicked={() => actions.rooms.focus(room)}
	getContext={() => roomContext(room)}
>
	<div class="avatar"><Avatar user={{ ...room, avatar: getAvatar(room) }} size={32} /></div>
	<div class="name">{getName(room)}</div>
	<div class="spacer"></div>
	{#if room.notifications.pings}<div class="pings">{room.notifications.pings}</div>{/if}
	{#if (room.power.me >= room.power.invite ?? 0) || room.joinRule === "public"}
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
