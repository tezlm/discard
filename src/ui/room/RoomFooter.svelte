<script>
import Typing from "../atoms/Typing.svelte";
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

async function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    if (!$input.trim()) return;

    // bootleg commands for now
    if ($input === "/shrug") $input = "¯\\\\\\_(ツ)_/¯";

    sendMessage({
      body: $input.trim(),
      format: "org.matrix.custom.html",
      formatted_body: marked(replacePing($input.trim())).trim(),
      msgtype: "m.text",
    });

    $input = "";
    $rows = 1;
  } else if (e.key === "Escape") {
    if ($reply) {
      reply.set(null);
    } else {
      const lastEvent = state.roomTimelines.get($room.roomId).live.at(-1);
      state.log.debug(`mark ${lastEvent} as read`);
      state.rooms.get($room.roomId).readEvent = lastEvent;
      state.slice.set(state.roomSlices.get($room.roomId));
      state.api.sendReceipt($room.roomId, lastEvent);  
    }
  } if (e.key === "ArrowUp") {
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

function handleInput() {
  $rows = Math.min($input.split("\n").length, 10);
}

async function handlePaste(e) {
  const file = e.clipboardData.files[0];
  if (!file) return;
  textarea.blur();
  state.popup.set({
    id: "upload",
    file,
    async confirm() {
      upload(file);
      textarea.focus();
    },
    cancel() {
      textarea.focus();
    },
  });
}

async function upload(file) {
  const status = { file, progress: 0, cancel: todo };
  const roomId = $room.roomId;
  fileUpload.set(status);
  const url = await state.api.uploadFile(file, ({ loaded, total }) => {
    status.progress = loaded / total;
    fileUpload.set(status);
  });

  fileUpload.set(null);

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
</script>
<style>
.container {
  padding: 0 16px;
}

.input {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  background: #40444b;
}

.input.disabled {
  background: var(--bg-spaces);
  cursor: not-allowed;
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
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: var(--fg-interactive);
  font-size: 14px;
  cursor: pointer;
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

.typing {
  height: 24px;
  padding-left: 12px;
  display: flex;
  align-content: center;
}
</style>
<div class="container">
  {#if $reply}
  <div class="reply" on:click={() => actions.slice.jump($reply.roomId, $reply.eventId)}>
    <div>Replying to <b>{getName($reply.sender)}</b></div>
    <div class="close" on:click={e => { e.stopPropagation(); reply.set(null) }}>
        <div class="icon">&#xd7</div>
    </div>
  </div>
  {/if}
  {#if $room.tombstone}
  <div class="input disabled">{$room.tombstone?.body ?? "This room has been replaced"}</div>
  {:else if $room.power?.getEvent("m.room.message") > $room.power?.me}
  <div class="input disabled">You can't send messages here</div>
  {:else}
  <div class="input">
    <div class="upload">
      <div class="upload-button"></div>
    </div>
    <textarea
      placeholder={`Message ${$room.name}`}
      rows={$rows}
      bind:this={textarea}
      bind:value={$input}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      on:paste={handlePaste}
    ></textarea>
  </div>
  {/if}
  <div class="typing">
    {#if $typing.length}
    <Typing users={[...$typing].map(getName)} />
    {/if}
  </div>
</div>
