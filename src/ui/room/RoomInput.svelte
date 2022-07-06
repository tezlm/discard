<script>
// TODO: split out editor from input (for edits)
import { getDisplayName } from "../../util/events.js";
export let placeholder;
let textarea;
let rows = 1;
let room = state.focusedRoom;
let reply = state.replyEvent;

async function handleKeyDown(e) {
  const value = e.target.value;
  if (e.key === "Enter" && !e.shiftKey && value.trim()) {
    e.preventDefault();
    e.target.value = "";
    rows = 1;
  console.log("submit")
    queueMicrotask(() => {
    const message = {
      body: value.trim(),
      format: "org.matrix.custom.html",
      formatted_body: value.trim().replace(/\n/g, "<br />"),
      msgtype: "m.text",
    };

    if ($reply) {
      message["m.relates_to"] = {};
      message["m.relates_to"]["m.in_reply_to"] = {};
      message["m.relates_to"]["m.in_reply_to"]["event_id"] = $reply.eventId;
      reply.set(null);
    }

    state.client.sendEvent(state.focusedRoomId, null, "m.room.message", message);

    // TODO: send read recipts
    // const { event_id } = await state.client.sendEvent(state.focusedRoomId, null, "m.room.message", { body: value.trim(), msgtype: "m.text" });
    // await state.client.sendReadReceipt(state.client.getEventMapper()({ event_id }), "m.fully_read");
    // state.rooms.set(client.getRooms().filter(i => i.getMyMembership() === "join"));
    });
  } else if (e.key === "Escape") {
    state.client.sendReadReceipt($room.timeline[$room.timeline.length - 1]);
  }
}

function handleInput(e) {
  const value = e.target.value;
  rows = Math.min(value.split("\n").length, 10);
}

state.focusedRoom.subscribe(() => queueMicrotask(() => textarea?.focus()));
state.replyEvent.subscribe(() => queueMicrotask(() => textarea?.focus()));
</script>
<style>
.input {
  display: flex;
  padding: 0 16px;
  margin: 0 16px 8px;
  border-radius: 8px;
  background: #40444b;
}

.upload {
  padding: 10px 0;
  padding-right: 16px;
  display: flex;
  align-items: center;
}

.upload-button {
  height: 24px;
  width: 24px;

  /* TODO actual upload icon */
  background: var(--fg-dim);
  border-radius: 50%;
}

textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  resize: none;

  flex: 1;
  padding: 11px 0;
}

textarea::placeholder {
  color: var(--fg-muted);
}

.reply {
  display: flex;
  justify-content: space-between;
  background: var(--bg-rooms-members);
  padding: .5rem 16px;
  margin: 0 16px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: var(--fg-interactive);
  font-size: 14px;
}

.close {
  display: flex;
  margin: -8px -16px;
  padding: 8px 16px;
  cursor: pointer;
}

/* TODO: like everything else, eventually find an actual icon*/
/* (this is worse than normal thanks to magic numbers) */
.close .icon {
  font-family: initial;
  font-size: 12px;
  height: 16px;
  width: 16px;
  background: var(--fg-interactive);
  border-radius: 50%;
  font-weight: 700;
  padding-left: 3px;
  color: var(--bg-rooms-members);
}

.close:hover .icon {
  background: var(--fg-content);  
}

.reply + .input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
{#if $reply}
<div class="reply">
  <div>Replying to <b>{getDisplayName($reply.sender)}</b></div>
  <div class="close" on:click={() => state.replyEvent.set(null)}>
      <div class="icon">&#xd7</div>
  </div>
</div>
{/if}
<div class="input">
  <div class="upload">
    <div class="upload-button"></div>
  </div>
  <textarea {rows} {placeholder} on:input={handleInput} on:keydown={handleKeyDown} bind:this={textarea}></textarea>
</div>
