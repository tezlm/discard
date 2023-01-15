<script>
import Typing from "../atoms/Typing.svelte";
import RoomInput from "./RoomInput.svelte";
let textareaEl;
let room = state.focusedRoom;
let { reply, edit, input, typing } = state.roomState;

const getName = id => ($room.members.get(id)?.name ?? id);

async function sendMessage(content, theRoom = $room) {
  if ($reply) {
    content["m.relates_to"] = {};
    content["m.relates_to"]["m.in_reply_to"] = {};
    content["m.relates_to"]["m.in_reply_to"]["event_id"] = $reply.id;
    // const body = $reply.content.body
    //   .split("\n")
    //   .map(i => "&gt; " + i)
    //   .join("\n");
    // const sender = $reply.sender.name ?? $reply.sender.id;
    // content.body = `${body}\n${sender} ${content.body}`;
    // content.formatted_body = `<mx-reply>${body}\n${sender}</mx-reply>${content.formatted_body}`;
    reply.set(null);
  }

  const id = `~${Math.random().toString(36).slice(2)}`;
  theRoom.accountData.set("m.fully_read", id);
  theRoom.sendEvent("m.room.message", content, id);
  state.log.debug("send event to " + theRoom.id);
}

function getRoomName(room) {
	if (room.name) return room.name;
	const other = state.dms.get(room.id);
	return other?.name ?? other?.id;
}

$: if ($input) textareaEl?.focus();
$: if ($room) textareaEl?.focus();
$: if ($reply || true) textareaEl?.focus();
$: if (!$edit) textareaEl?.focus();
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
    showUpload
    placeholder={`Message ${getRoomName($room)}`}
    onsend={sendMessage}
    bind:input={$input}
    bind:reply={$reply}
    bind:textarea={textareaEl}
  />
  {/if}
  <div class="typing">
    {#if $typing.length}
    <Typing room={$room} users={[...$typing].map(getName)} />
    {/if}
  </div>
</div>
{/if}
