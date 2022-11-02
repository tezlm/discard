<script>
import Typing from "../atoms/Typing.svelte";
import RoomInput from "./RoomInput.svelte";
let textarea;
let room = state.focusedRoom;
let { reply, edit, input, typing } = state.roomState;

const getName = id => ($room.members.get(id)?.name ?? id);

async function sendMessage(content, theRoom = $room) {
  if ($reply) {
    content["m.relates_to"] = {};
    content["m.relates_to"]["m.in_reply_to"] = {};
    content["m.relates_to"]["m.in_reply_to"]["event_id"] = $reply.id;
    reply.set(null);
  }

  actions.timeline.send(theRoom, "m.room.message", content);
  state.log.debug("send event to " + theRoom.id);

  // const { event_id } = await state.client.sendEvent($room.roomId, null, "m.room.message", content);
  // state.client.sendReadReceipt($room.timeline.find(i => i.getId() === event_id)); // FIXME: flash of unread on message send
}

$: if ($input) textarea?.focus();
$: if ($room) textarea?.focus();
$: if ($reply || true) textarea?.focus();
$: if (!$edit) textarea?.focus();
</script>
<style>
.container {
  padding: 0 16px;
  z-index: 2;
}

.input {
  display: flex;
  align-items: center;
  min-height: 44px;
  border-radius: 8px;
  background: #40444b;
}

.input.disabled {
  background: var(--bg-spaces);
  cursor: not-allowed;
}

.input.disabled a {
  cursor: pointer;
}

.center {
  padding: 0 16px;
}

.typing {
  height: 24px;
  padding-left: 12px;
  display: flex;
  align-content: center;
}
</style>
{#if $room}
<div class="container">
  {#if $room.tombstone}
  {@const replacement = state.rooms.get($room.tombstone.replacement_room)}
  <div class="input disabled"><div class="center">{$room.tombstone?.body ?? "This room has been replaced"}{#if replacement}. Why not visit the <a on:click={() => actions.rooms.focus(replacement)}>new room</a>?{/if}</div></div>
  {:else if $room.power?.forEvent("m.room.message") > $room.power?.me}
  <div class="input disabled"><div class="center">You can't send messages here</div></div>
  {:else if $room.getState("m.room.encryption")}
  <div class="input disabled"><div class="center">You can't send messages in a e2ee room yet</div></div>
  {:else}
  <RoomInput
    showUpload={true}
    placeholder={`Message ${$room.name}`}
    onsend={sendMessage}
    bind:input={$input}
    bind:reply={$reply}
    bind:textarea={textarea}
  />
  {/if}
  <div class="typing">
    {#if $typing.length}
    <Typing users={[...$typing].map(getName)} />
    {/if}
  </div>
</div>
{/if}
