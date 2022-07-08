<script>
// TODO: split out editor from input (for edits)
// TODO: refactor, this code is a mess
import { marked } from "marked";
import { getDisplayName } from "../../util/events.js";
let textarea;
let room = state.focusedRoom;
let roomState = state.roomState;
$: reply = $roomState.reply;
$: value = $roomState.value;
$: rows = $roomState.rows ?? 1;

async function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey && value.trim()) {
    e.preventDefault();
    $roomState.value = "";
    $roomState.rows = 1;

    sendMessage({
      body: value.trim(),
      format: "org.matrix.custom.html",
      formatted_body: marked(value.trim()).trim(),
      msgtype: "m.text",
    });
  } else if (e.key === "Escape") {
    if (reply) {
      $roomState.reply = null;
    } else {
      state.client.sendReadReceipt($room.timeline[$room.timeline.length - 1]);  
    }
  }
}

function handleInput() {
  $roomState.rows = Math.min(value.split("\n").length, 10);
  $roomState.value = value;
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
  const upload = { file, progress: 0, cancel: todo };
  state.fileUpload.set(upload);
  const url = await state.client.uploadContent(file, {
    progressHandler({ loaded, total }) {
      upload.progress = loaded / total;
      state.fileUpload.set(upload);
    }
  });

  state.fileUpload.set(null);

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
  });

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

async function sendMessage(content) {
  if (reply) {
    content["m.relates_to"] = {};
    content["m.relates_to"]["m.in_reply_to"] = {};
    content["m.relates_to"]["m.in_reply_to"]["event_id"] = reply.eventId;
    $roomState.reply = null;
  }

  await state.client.sendEvent($room.roomId, null, "m.room.message", content);

  // const { event_id } = await state.client.sendEvent($room.roomId, null, "m.room.message", content);
  // state.client.sendReadReceipt($room.timeline.find(i => i.getId() === event_id)); // FIXME: flash of unread on message send
}

state.focusedRoom.subscribe(() => queueMicrotask(() => textarea?.focus()));
roomState.subscribe(() => queueMicrotask(() => textarea?.focus()));
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
</style>
{#if reply}
<div class="reply" on:click={() => actions.slice.jump(reply.eventId)}>
  <div>Replying to <b>{getDisplayName(reply.sender)}</b></div>
  <div class="close" on:click={() => $roomState.reply = null}>
      <div class="icon">&#xd7</div>
  </div>
</div>
{/if}
<div class="input">
  <div class="upload">
    <div class="upload-button"></div>
  </div>
  <textarea
    {rows}
    placeholder={`Message ${$room.name}`}
    bind:this={textarea}
    bind:value={value}
    on:input={handleInput}
    on:keydown={handleKeyDown}
    on:paste={handlePaste}
  ></textarea>
</div>
