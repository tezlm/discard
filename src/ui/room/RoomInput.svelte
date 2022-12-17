<script>
import Reply from "./input/Reply.svelte";
import Autocomplete from "../molecules/Autocomplete.svelte";
import RoomTextarea from "./input/RoomTextarea.svelte";
import EmojiButton from "./input/EmojiButton.svelte";
import { render } from "../../util/markdown";
import { quadOut } from "svelte/easing";

export let onsend;
export let placeholder = "";
export let showUpload = false;
export let reply = null;
export let input = "";

export let textarea;
let showEmoji = false;

export let asdfasdfasdf = false;

let { focusedRoom: room, focusedSpace, slice, popup } = state;
let { edit } = state.roomState;

let isDragging = false;
let isShift = false;

function markRead(room) {
  actions.rooms.markRead(room);
  if (room.type === "m.space") {
    for (let child of state.spaces.get(room.id)) {
      markRead(child);
    }
  }
}

function handleKeyDown(e) {
  if (e.altKey) return;
  if (e.key === "Escape") {
    if (showEmoji) {
      showEmoji = false;
    } else if (reply) {
      reply = null;
    } else if (e.shiftKey) {
      markRead($focusedSpace);
    } else {
      markRead($room);
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  } else if (e.key === "ArrowUp") {
    if (textarea.selectionStart !== 0) return;
    if (textarea.selectionEnd !== 0) return;
    for (let i = $slice.events.length - 1; i >= 0; i--) {
      const event = $slice.events[i];
      if (event.sender.id === state.userId) {
        $edit = event.id;
        return;
      }
    }
  } else if (e.key === "PageUp") {
    const el = document.getElementById("scrollTEMPIDWILLBEREMOVED");
    el.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" });
  } else if (e.key === "PageDown") {
    const el = document.getElementById("scrollTEMPIDWILLBEREMOVED");
    el.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" });
  }
}

function oninput(input) {
  // bootleg commands ftw!
  if (input === "/shrug") input = "¯\\\\\\_(ツ)\\_/¯";

  input = input.trim();

  const html = render(input);
  onsend({
    body: input,
    format: "org.matrix.custom.html",
    formatted_body: html,
    msgtype: "m.text",

    // extensible events!
    // "org.matrix.msc1767.message": [
    //   { mimetype: "text/plain", body: input },
    //   { mimetype: "text/html",  body: html  },
    // ],
    // "m.text": input,
    // "m.html": html,
  });
}

function onfile(file) {
  if (!file) return;
  textarea.blur();
  $popup = {
    id: "upload",
    file,
    confirm() {
      handleUpload(file);
      textarea.focus();
    },
    cancel() {
      textarea.focus();
    },
  };
  return new Promise(res => {
    const unsub = popup.subscribe(({ id }) => {
      if (id) return;
      unsub();
      res();
    });
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
  const info = {
    mimetype: file.type,
    size: file.size,
    ...(["m.image", "m.video", "m.audio"].includes(type) ? await getSize(file, type) : {}),
    filename: file.name,
  };

  onsend({
    url,
    body: file.name,
    msgtype: type,
    info,
    
    // "m.file": {
    //   url,
    //   name: file.name,
    //   mimetype: file.type,
    //   size: file.size,
    // },
    // ...(type === "m.image" && { "m.image": { width: info.w, height: info.h } }),
    // ...(type === "m.video" && { "m.video": { width: info.w, height: info.h, duration: info.d } }),
    // "m.thumbnail": { width: info.w, height: info.h },
    // "m.caption": [{ m.message-like object }],
    "m.text": file.name,
  });

  function getSize(file, type) {
    return new Promise(res => {
      if (type === "m.image") {
        const img = new Image();
        img.onload = () => res({ w: img.width, h: img.height });
        img.src = URL.createObjectURL(file);
      } else if (type === "m.video") {
        const vid = document.createElement("video");
        vid.onloadedmetadata = () => res({ w: vid.videoWidth, h: vid.videoHeight, duration: Math.floor(vid.duration * 1000) });
        vid.src = URL.createObjectURL(file);
      } else if (type === "m.audio") {
        const aud = document.createElement("audio");
        aud.onloadedmetadata = () => res({ duration: Math.floor(aud.duration * 1000) });
        aud.src = URL.createObjectURL(file);
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

async function handleDrop(e) {
  isDragging = false;
  for (let file of e.dataTransfer.files) {
    if (isShift) {
      await handleUpload(file);
    } else {
      await onfile(file);
    }
  }
  textarea?.focus();
}

function blur() {
  return {
    duration: 300,
    css: t => `background: rgba(${t * 34}, ${t * 34}, ${t * 34}, ${t * .51}); backdrop-filter: blur(${t * 4}px)`,
  };
}

function slide() {
  return {
    duration: 300,
    easing: quadOut,
    css: t => `transform: translateY(${80 - (t * 80)}px) rotate(${-t * 12 + 6}deg); opacity: ${t}`,
  };
}
</script>
<style>
.container {
  position: relative;
}

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

.input.asdfasdfasdf {
  border-radius: 4px;
  background: var(--bg-misc);
}

.upload {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 8px 16px 0;
  font-size: 24px;
  color: var(--fg-light);
  cursor: pointer;
}

.upload:hover, .upload:focus {
  color: var(--fg-notice);
}

.upload:focus {
  outline: solid var(--color-accent) 3px;
}

.upload input {
  display: none;
}

.autocomplete {
  position: absolute;
  bottom: calc(100% + 8px);
  width: 100%;
}

.drop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(34, 34, 34, .51);
  backdrop-filter: blur(4px);
}

.drop-info {
  display: flex;
  transform: rotate(-6deg);
  height: 200px;
  width: 300px;
  background: var(--color-accent);
  padding: 8px;
  border-radius: 8px;
  pointer-events: none;
}

.drop-info div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: dashed white 3px;
  padding: 2px;
  border-radius: 8px;
  font-family: var(--font-display);
}
</style>
<div class="container" on:keydown={handleKeyDown}>
  {#if false}
  <div class="autocomplete">
    <Autocomplete />
  </div>
  {/if}
  {#if reply}
    <Reply
      event={reply}
      onclick={() => actions.slice.jump(reply.room.id, reply.id)}
      onclose={() => reply = null}
    />
  {/if}
  <div class="input" class:asdfasdfasdf class:withreply={reply}>
    {#if showUpload}
    <label class="upload" tabindex="0" on:keydown={e => e.key === "Enter" && e.target.click()}>
      <div class="icon">add_circle</div>
      <input type="file" on:change={e => onfile(e.target.files[0])} />
    </label>
    {/if}
    <RoomTextarea {placeholder} {asdfasdfasdf} bind:input={input} bind:textarea={textarea} {onfile} {oninput} />
    <!--
    <div class="icon" style="font-size: 28px; color: var(--fg-light)">gif_box</div>
    <div class="icon" style="font-size: 28px; margin-left: 8px; color: var(--fg-light)">sticky_note_2</div>
    -->
    <EmojiButton bind:show={showEmoji} picked={(emoji, keep) => { input += emoji; keep || textarea.focus() }} />
  </div>
  {#if isDragging}
  <div class="drop" on:dragleave={() => isDragging = false} transition:blur>
    <div class="drop-info" transition:slide>
      <div>
        {#if isShift}
        <h2>insta upload mode!</h2>
        {:else}
        <h2>drop to upload!</h2>
        {/if}
        <p>hold shift to bypass upload preview</p>
      </div>
    </div>
  </div>
  {/if}
</div>
<svelte:window
  on:dragover|preventDefault={(e) => { isShift = e.shiftKey }}
  on:dragstart={(e) => { isShift = e.shiftKey }}
  on:dragenter|preventDefault={(e) => { isDragging = true; isShift = e.shiftKey && false }}
  on:drop|preventDefault={handleDrop}
/>