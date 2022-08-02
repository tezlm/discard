<script>
import EmojiButton from "./input/EmojiButton.svelte";
import RoomTextarea from "./input/RoomTextarea.svelte";
import Reply from "./input/Reply.svelte";
import { marked } from "marked";

export let onsend;
export let placeholder = "";
export let showUpload = false;
export let reply = null;
export let input = "";

export let textarea;
let showEmoji = false;

let room = state.focusedRoom;
let slice = state.slice;
let edit = state.roomState.edit;

function handleKeyDown(e) {
  if (e.key === "Escape") {
    if (showEmoji) {
      showEmoji = false;
    } else if (reply) {
      reply = null;
    } else {
      const lastEvent = state.roomTimelines.get($room.roomId).live.at(-1);
      state.log.debug(`mark ${lastEvent} as read`);
      state.rooms.get($room.roomId).readEvent = lastEvent;
      state.slice.set(state.roomSlices.get($room.roomId));
      state.api.sendReceipt($room.roomId, lastEvent);
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  } else if (e.key === "ArrowUp") {
    if (textarea.selectionStart !== 0) return;
    if (textarea.selectionEnd !== 0) return;
    for (let i = $slice.events.length - 1; i >= 0; i--) {
      const event = $slice.events[i];
      if (event.sender.userId === state.userId) {
        $edit = event.eventId;
        return;
      }
    }
  } else if (e.key === "ArrowDown") {
  }
}

function oninput(input) {
  function replacePing(input) {
    function getName(id) {
      const member = $room.members.get(id);
      if (!member) return id;
      return member.name ? ("@" + member.name) : member.userId;
    }

    return input.replace(
      /@[a-z0-9-_/]+:[a-z0-9.-]+/ig,
      (match) => `<a href="https://matrix.to/#/${match}">${getName(match)}</a>`
    );
  }

  // bootleg commands ftw!
  if (input === "/shrug") input = "¯\\\\\\_(ツ)\\_/¯";

  onsend({
    body: input.trim(),
    format: "org.matrix.custom.html",
    formatted_body: marked(replacePing(input.trim())).trim(),
    msgtype: "m.text",
  });
}

async function onfile(file) {
  if (!file) return;
  textarea.blur();
  state.popup.set({
    id: "upload",
    file,
    async confirm() {
      handleUpload(file);
      textarea.focus();
    },
    cancel() {
      textarea.focus();
    },
  });
}

let { upload: fileUpload } = state.roomState;
async function handleUpload(file) {
  const status = { file, progress: 0, cancel: () => {} };
  const { promise, abort } = await state.api.uploadFile(file, ({ loaded, total }) => {
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

  onsend({
    url,
    body: file.name,
    msgtype: type,
    info: {
      mimetype: file.type,
      size: file.size,
      ...(["m.image", "m.video"].includes(type) ? await getSize(file, type) : {}),
    }
  });

  function getSize(file, type) {
    return new Promise(res => {
      if (type === "m.image") {
        const img = new Image();
        img.onload = () => res({ w: img.width, h: img.height });
        img.src = URL.createObjectURL(file);
      } else if (type === "m.video") {
        const vid = document.createElement("video");
        vid.onloadedmetadata = () => res({ w: vid.videoWidth, h: vid.videoHeight });
        vid.src = URL.createObjectURL(file);
      } else {
        throw "unreachable?";
      }
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
</script>
<style>
.input {
  display: flex;
  min-height: 44px;
  border-radius: 8px;
  background: #40444b;
}

.input.withreply {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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
</style>
<div class="container" on:keydown={handleKeyDown}>
  {#if reply}
    <Reply
      event={reply}
      onclick={() => actions.slice.jump(reply.roomId, reply.eventId)}
      onclose={() => reply = null}
    />
  {/if}
  <div class="input" class:withreply={reply}>
    {#if showUpload}
    <label class="upload">
      <div class="icon">
          add_circle
          <input type="file" on:change={e => onfile(e.target.files[0])} />
      </div>
    </label>
    {/if}
    <RoomTextarea {placeholder} bind:textarea={textarea} {onfile} {oninput} />
    <EmojiButton bind:show={showEmoji} picked={(emoji, keep) => { textarea.value += emoji; keep || textarea.focus() }} />
  </div>
</div>
