<script>
export let placeholder;
let textarea;
let rows = 1;
let room = state.focusedRoom;

async function handleInput(e) {
  const value = e.target.value;
  if (e.key === "Backspace" || e.key === "Delete" || (e.key === "Enter" && e.shiftKey)) {
    rows = Math.min(value.split("\n").length, 10);
  } else if (e.key === "Enter" && value.trim()) {
    e.preventDefault();
    e.target.value = "";
    state.client.sendEvent(state.focusedRoomId, null, "m.room.message", { body: value.trim(), msgtype: "m.text" });
    // TODO: send read recipts
    // const { event_id } = await state.client.sendEvent(state.focusedRoomId, null, "m.room.message", { body: value.trim(), msgtype: "m.text" });
    // await state.client.sendReadReceipt(state.client.getEventMapper()({ event_id }), "m.fully_read");
    // state.rooms.set(client.getRooms().filter(i => i.getMyMembership() === "join"));
  } else if (e.key === "Escape") {
    state.client.sendReadReceipt($room.timeline[$room.timeline.length - 1], "m.fully_read");
  }
}

state.focusedRoom.subscribe(() => queueMicrotask(() => textarea?.focus()));
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
</style>
<div class="input">
  <div class="upload">
    <div class="upload-button"></div>
  </div>
  <textarea {rows} {placeholder} on:keydown={handleInput} bind:this={textarea}></textarea>
</div>
