<script>
import Avatar from "../../atoms/Avatar.svelte";
import { calculateHash } from "../../../util/content";
import { fastclick } from "../../../util/use";
export let room;
export let event;
export let shiftKey;
$: topic = room.topic;

const words = ["glorious", "awesome", "legendary", "epic", "incredible"];

let { dms } = state;

function getName(room) {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}

function edit() {
  state.selectedRoom.set(room);
  actions.to(`/room-settings/${room.id}`);
}

function invite() {
  state.popup.set({ id: "invite", room });
}
</script>
<style>
.top {
  margin-top: 48px;
  padding: 2px 16px;
}

h1 {
  font-family: var(--font-display);
}

.info {
  color: var(--fg-light);
  margin-top: 8px;
}

button {
  display: inline-flex;
  padding: 6px;
  margin-top: 16px;
  border-radius: 4px;
  color: var(--color-link);
  cursor: pointer;
}

button:focus {
  outline: solid var(--color-accent) 3px;
}

button .icon {
  margin-right: 8px;
}

button:hover,
button:focus {
  background: rgba(220, 220, 250, .1);
}
</style>
<div class="top">
  {#if dms.has(room.id)}
  <Avatar user={dms.get(room.id)} size=72 link />
  <h1>{getName(room)}</h1>
  <div class="info">This is the beginning of your {words[calculateHash(event.id) % words.length]} conversation with <b>{getName(room)}</b>. {#if topic}{topic}{/if}</div>
  {:else if event.content.predecessor}
  <h1>Welcome back to {getName(room)}!</h1>
  <div class="info">This is a <a use:fastclick on:fastclick={() => actions.to(`/room/${event.content.predecessor.room_id}`)} style="cursor: pointer">continuation</a> of the {getName(room)} room. {#if topic}{topic}{/if}</div>
  {:else}
  <h1>Welcome to {getName(room)}!</h1>
  <div class="info">This is the start of the <b>{getName(room)}</b> room. {#if topic}{topic}{/if}</div>
  {/if}
  {#if !room.tombstone && !dms.has(room.id)}
    {#if room.power.me >= (room.power.invite ?? 0) || room.joinRule === "public"}
    <button use:fastclick on:fastclick={invite}>
      <div class="icon">person_add</div>
      Invite Users
    </button>
    {/if}
    <button use:fastclick on:fastclick={edit}>
      <div class="icon">edit</div>
      Edit Room
    </button>
  {/if}
  <!--
  {#if shiftKey}
  <div class="action" use:fastclick on:fastclick={() => state.popup.set({ id: "source", event })}>
    <div class="icon">terminal</div>
    View Source
  </div>
  {/if}
  -->
</div>
