<script>
// TODO: video dimensions
// TODO: split out input from rest of footer
import Typing from "../atoms/Typing.svelte";
import RoomInput from "./RoomInput.svelte";
import { marked } from "marked";
import { onDestroy } from "svelte";
let textarea;
let room = state.focusedRoom;
let slice = state.slice;
let { reply, edit, input, rows, upload: fileUpload, typing } = state.roomState;

const getName = id => ($room.members.get(id)?.name ?? id.replace(/^@/, ""));

function replacePing(input) {
  return input.replace(
    /@[a-z0-9-_/]+:[a-z0-9.-]+/ig,
    (match) => `<a href="https://matrix.to/#/${match}">@${getName(match)}</a>`
  );
}

async function handleSend(e) {
  sendMessage(e)
  return console.log(e)
}

async function handleKeyDown(e) {
  if (e.key === "Escape") {
    const lastEvent = state.roomTimelines.get($room.roomId).live.at(-1);
    state.log.debug(`mark ${lastEvent} as read`);
    state.rooms.get($room.roomId).readEvent = lastEvent;
    state.slice.set(state.roomSlices.get($room.roomId));
    state.api.sendReceipt($room.roomId, lastEvent);  
  } if (e.key === "ArrowUp") {
    // FIXME: arrow up/down to select message edit
    if (textarea.selectionStart !== 0) return;
    if (textarea.selectionEnd !== 0) return;
    for (let i = $slice.events.length - 1; i >= 0; i--) {
      const event = $slice.events[i];
      if (event.sender === state.userId) {
        $edit = event.eventId;
        return;
      }
    }
  }
}

async function handleUpload(file) {
  const status = { file, progress: 0, cancel: () => {} };
  const roomId = $room.roomId;
  const { promise, abort }= await state.api.uploadFile(file, ({ loaded, total }) => {
    status.progress = loaded / total;
    fileUpload.set(status);
  });
  status.cancel = abort;
  fileUpload.set(status);

  const url = await promise.catch((err) => {
    if (err) console.error(err);
    return null;
  });
  fileUpload.set(null);
  if (!url) return;

  const type = getType(file.type);

  sendMessage({
    url,
    body: file.name,
    msgtype: type,
    info: {
      mimetype: file.type,
      size: file.size,
      ...(type === "m.image" ? await getSize(file) : {}),
    }
  }, roomId);

  function getSize(file) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res({ w: img.width, h: img.height });
      img.src = URL.createObjectURL(file);
    });
  }

  function getType(mime) {
    switch (mime.split("/")[0]) {
      case "image": return "m.image";
      case "video": return "m.video";
      case "audio": return "m.audio";
      default: return "m.file";
    }
  }
}

async function sendMessage(content, roomId = $room.roomId) {
  if ($reply) {
    content["m.relates_to"] = {};
    content["m.relates_to"]["m.in_reply_to"] = {};
    content["m.relates_to"]["m.in_reply_to"]["event_id"] = $reply.eventId;
    reply.set(null);
  }

  actions.timeline.send(roomId, "m.room.message", content);
  state.log.debug("send event to " + roomId);

  // const { event_id } = await state.client.sendEvent($room.roomId, null, "m.room.message", content);
  // state.client.sendReadReceipt($room.timeline.find(i => i.getId() === event_id)); // FIXME: flash of unread on message send
}

onDestroy(state.focusedRoom.subscribe(() => queueMicrotask(() => textarea?.focus())));
onDestroy(reply.subscribe(() => queueMicrotask(() => textarea?.focus())));
onDestroy(edit.subscribe(() => queueMicrotask(() => $edit || textarea?.focus())));
</script>
<style>
.container {
  padding: 0 16px;
  z-index: 1;
}

.input {
  display: flex;
  min-height: 44px;
  border-radius: 8px;
  background: #40444b;
}

.input.disabled {
  background: var(--bg-spaces);
  cursor: not-allowed;
}

.center {
  display: flex;
  align-items: center;
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
  <div class="input disabled"><div class="center">{$room.tombstone?.body ?? "This room has been replaced"}</div></div>
  {:else if $room.power?.getEvent("m.room.message") > $room.power?.me}
  <div class="input disabled"><div class="center">You can't send messages here</div></div>
  {:else}
  <RoomInput
    showUpload={true}
    placeholder={`Message ${$room.name}`}
    onsend={handleSend}
    handleUpload={handleUpload}
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
