<script>
import Typing from "../atoms/Typing.svelte";
import Emoji from "../molecules/Emoji.svelte";
import { marked } from "marked";
import { onDestroy } from "svelte";
import twemoji from "twemoji";
let textarea;
let room = state.focusedRoom;
let slice = state.slice;
let { reply, edit, input, rows, upload: fileUpload, typing } = state.roomState;
let showEmoji = false;

// magic numbers in this file?

// TODO: split out input from rest of footer

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
    if (showEmoji) {
      showEmoji = false;
    } else if ($reply) {
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
  if (e.clipboardData.files.length) e.preventDefault();
  handleUpload(e.clipboardData.files[0]);
}

async function handleUpload(file) {
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

.upload {
  padding: 8px 16px 0;
  align-items: start;
  font-size: 24px;
  color: var(--fg-light);
  cursor: pointer;
}

.upload:hover {
  color: var(--fg-notice);
}

.upload input {
  display: none;
}

.upload.disabled {
  cursor: not-allowed;
}

.upload.disabled .icon {
  color: var(--fg-dim);
  cursor: not-allowed;
}

.emoji {
  position: relative;
}

.emoji .button {
  padding: 11px 12px 0;
  height: 100%;
  pointer-events: all;
  cursor: pointer;
}

.emoji .button .icon {
  height: 22px;
  width: 22px;
  filter: grayscale(1);
  transition: all .2s ease-out;
}

.emoji:hover .button .icon, .emoji .icon.shown {
  filter: grayscale(0);
  transform: scale(1.2);
}

.emoji .wrapper {
  position: absolute;
  bottom: calc(56px);
  right: 0;
  pointer-events: all;
}

textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  resize: none;

  flex: 1;
  padding: 12px 0;
}

textarea::placeholder {
  color: var(--fg-muted);
}

.reply {
  position: relative;
  background: var(--bg-rooms-members);
  padding: .5rem 16px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: var(--fg-interactive);
  font-size: 14px;
  cursor: pointer;
}

.close {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  top: 0;
  right: 0;
  padding: 0 18px;

  font-size: 18px;
  cursor: pointer;
  color: var(--fg-interactive);
}

.close:hover {
  color: var(--fg-content);  
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
{#if $room}
<div class="container">
  {#if $reply}
  <div class="reply" on:click={() => actions.slice.jump($reply.roomId, $reply.eventId)}>
    <div>Replying to <b>{getName($reply.sender)}</b></div>
    <div class="close icon" on:click={e => { e.stopPropagation(); reply.set(null) }}>cancel</div>
  </div>
  {/if}
  {#if $room.tombstone}
  <div class="input disabled"><div class="center">{$room.tombstone?.body ?? "This room has been replaced"}</div></div>
  {:else if $room.power?.getEvent("m.room.message") > $room.power?.me}
  <div class="input disabled"><div class="center">You can't send messages here</div></div>
  {:else}
  <div class="input">
    <label class="upload">
      <div class="icon">
          add_circle
          <input type="file" on:change={e => handleUpload(e.target.files[0])} />
      </div>
    </label>
    <textarea
      placeholder={`Message ${$room.name}`}
      rows={$rows}
      bind:this={textarea}
      bind:value={$input}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      on:paste={handlePaste}
    ></textarea>
    <div class="emoji">
      <div class="button" on:click={(e) => { e.stopImmediatePropagation(); showEmoji = !showEmoji }}>
        <div class="icon" class:shown={showEmoji}>
          {@html twemoji.parse("😀", {
            folder: "svg",
            ext: ".svg",
          })}
        </div>
      </div>
      {#if showEmoji}
      <div class="wrapper">
        <Emoji selected={(val, keep) => { val && ($input += val); if (!keep) { showEmoji = false; textarea.focus() } }}/>
      </div>
      {/if}
    </div>
  </div>
  {/if}
  <div class="typing">
    {#if $typing.length}
    <Typing users={[...$typing].map(getName)} />
    {/if}
  </div>
</div>
{/if}
<svelte:window on:click={() => showEmoji = false} />
