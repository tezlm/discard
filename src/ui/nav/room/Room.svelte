<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
import { roomContext } from "../../../util/context";
import { getLastMessage } from "../../../util/timeline";
export let room;
export let muted = false;
let { focusedRoom, popup } = state;
let dms = state.dms;
$: focused= $focusedRoom?.id === room.id;

// move dm status into the room object?
function getName(room) {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}

function isRead(room) {
	if (muted) return true;
	
	const tl = room.events.live;
	if (!tl) return room.notifications.unread === 0;
	return getLastMessage(tl, room.readEvent) === getLastMessage(tl);
}

function openSettings(room) {
	return () => {
		state.selectedRoom.set(room);
		actions.to(`/room-settings/${room.id}`);
	};
}

function getIcon(room) {
	const type = room.getState("m.room.create")?.content.type;
	if (type === "org.eu.celery.room.media") return "image";
	if (type === "org.eu.celery.room.forum") return "message";
	if (type === "io.element.video") return "volume_up";
	if (dms.has(room.id)) return "person";
	if (!type) {
		if (room.power.usersDefault < room.power.forEvent("m.room.message")) {
			// return "campaign";
			// return "satellite_alt";
			// return "newspaper";
			// return "feed";
		}
		// return "numbers";
		return "tag";
	}
	return "help";
}
</script>
<style>
.room-icon {
	position: absolute;
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

.mentions {
	display: inline-block;
	height: 16px;
	min-width: 16px;
	padding: 0 4px;
	margin-right: 4px;

	text-align: center;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 11px;
}

.hover.focused {
	display: block;
}
</style>
<Item
	{focused}
	{muted}
	unread={!isRead(room)}
	clicked={() => actions.to(`/room/${room.id}`)}
	getContext={() => roomContext(room)}
>
	<div class="icon room-icon">{getIcon(room)}</div>
	<div class="name">{getName(room)}</div>
	<div class="spacer"></div>
	{#if room.notifications.highlight}<div class="mentions">{room.notifications.highlight}</div>{/if}
	{#if room.power.me >= room.power.invite || room.joinRule === "public"}
	<div class="settings hover" class:focused on:click|stopPropagation={(e) => $popup = { id: "invite", type: "room", room }}>
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
