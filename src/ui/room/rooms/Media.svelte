<script>
import { onMount } from "svelte";
import Video from "../../molecules/files/Video.svelte";
import File from "../../molecules/files/File.svelte";
import Audio from "../../molecules/files/Audio.svelte";
import Text from "../../molecules/files/Text.svelte";
import MessageReactions from '../message/MessageReactions.svelte';
import { parseMxc } from "../../../util/content";
export let room;
export let slice;

async function onfile(file) {
  if (!file) return;
  state.popup.set({
    id: "upload",
    file,
    async confirm() {
      handleUpload(file);
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
  const info = {
    mimetype: file.type,
    size: file.size,
    ...(["m.image", "m.video"].includes(type) ? await getSize(file, type) : {}),
  };

  actions.timeline.send(room.id, "m.room.message", {
    url,
    body: file.name,
    msgtype: type,
    info,
    
    "m.file": {
      url,
      name: file.name,
      mimetype: file.type,
      size: file.size,
    },
    ...(type === "m.image" && { "m.image": { width: info.w, height: info.h } }),
    ...(type === "m.video" && { "m.video": { width: info.w, height: info.h, duration: info.d } }),
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
        // info.d doesnt officially exist, but makes implementing extensible events easier
        vid.onloadedmetadata = () => res({ w: vid.videoWidth, h: vid.videoHeight, d: vid.duration });
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

let scrollEl, debounce, paginating = false;
function handleScroll() {
  if (paginating) return;
  clearTimeout(debounce);
  debounce = setTimeout(paginate, 20);
}

async function paginate() {
  const margin = 1;
  const scrollTop = scrollEl.scrollTop;
  const scrollBottom = scrollEl.scrollHeight - scrollEl.offsetHeight - scrollTop;

  if (scrollTop < margin) {
    state.log.debug("paginate forwards");
    const childNode = scrollEl.children[0];
    const scrollPos = childNode?.offsetTop;
    await fetchForwards();
    if (document.body.contains(childNode)) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  } else if (scrollBottom < margin) {
    state.log.debug("paginate backwards");
    const childNode = scrollEl.children[scrollEl.children.length - 1];
    const scrollPos = childNode?.offsetTop;
    await fetchBackwards();
    // if (document.body.contains(childNode)) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  }
}

async function fetchBackwards() { 
	const success = await actions.slice.backwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

async function fetchForwards() {
	const success = await actions.slice.forwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

function getContextMenu(event) {
  const menu = [];
  if (event.room.power.me >= event.room.power.forEvent("m.room.reaction")) {
    menu.push({ label: "Add Reaction", clicked: todo, submenu: [
      { label: "thumbsup",   clicked: (e) => addReaction(e, "👍️"), icon: "👍️" },
      { label: "thumbsdown", clicked: (e) => addReaction(e, "👎️"), icon: "👎️" },
      { label: "eyes",       clicked: (e) => addReaction(e, "👀"), icon: "👀" },
      { label: "sparkles",   clicked: (e) => addReaction(e, "✨"), icon: "✨" },
      { label: "Other Reactions", icon: "add_reaction", clicked: todo },
    ] });
  }
  if (event.reactions?.size) {
    menu.push({ label: "Reactions", icon: "emoji_emotions", clicked: () => state.popup.set({ id: "reactions", event }) });
  }
  menu.push({ label: "Copy Link",   icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${room.id}/${event.id}`) });
  if ((event.room.power.me >= event.room.power.forEvent("m.room.redaction") && event.sender.id === state.userId) || (event.room.power.me >= event.room.power.redact)) {
    menu.push({ label: "Delete Message", icon: "delete", color: "var(--color-red)", clicked: () => { event.special = "redacted"; state.api.redactEvent(event.roomId, event.eventId) } });
  }
  menu.push(null);
  menu.push({ label: "View Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
  return menu;

  function addReaction(e, emoji) {
    e.stopPropagation();
    state.context.set({})
    if (!event.reactions?.get(emoji)?.find(i => i.sender.id === state.userId)) {
      const reaction = {
        "m.relates_to": {
          key: emoji,
          rel_type: "m.annotation",
          event_id: event.id,
        },
      };
      state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
    }
  }
}

onMount(paginate);
</script>
<style>
.content {
  flex: 1;
  display: grid;
  /* todo: find out how to auto-fit items */
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  grid-auto-rows: 300px;
  padding: 8px;
  background: #2c2e33;
}

.item {
  display: flex;
  flex-direction: column;
  margin: 8px;
  padding: 8px;
  background: var(--bg-content);
  border-radius: 3px;
  cursor: pointer;
  transition: background .2s;
}

.item:hover {
  background: var(--bg-rooms-members);
}

.upload input {
  display: none;
}

.upload .icon {
  flex: 1;
  font-size: 64px;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color .2s;
}

.upload:hover .icon {
  color: var(--fg-notice);
}

.item img {
  height: 100%;
  object-fit: contain;
}
</style>
<div class="content scroll" bind:this={scrollEl} on:scroll={handleScroll}>
  {#if slice.atEnd()}
  <label class="item upload">
    <div class="icon">
        add_circle
        <input type="file" on:change={e => onfile(e.target.files[0])} />
    </div>
    <div style="text-align: center; margin-bottom: 1em;">
      upload another
    </div>
  </label>
  {/if}
  {#each [...slice.events].reverse() as event (event.eventId)}
  {#if event.type === "m.room.message"}
    {@const type = event.content.msgtype ?? event.type}
    {@const content= event.content}
    <div class="item" eventid={event.eventId} on:contextmenu|stopPropagation={e => { if (e.target.tagName === "A") return; e.preventDefault(); state.context.set({ items: getContextMenu(event), x: e.clientX, y: e.clientY }) }}>
      {#if type === "m.image"}
        <div style="margin: 4px; text-align: center">
          {content.body}
        </div>
        <img
          src={parseMxc(content.url)}
          alt={content.body}
          title={content.body}
          on:click={() => state.popup.set({ id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) })}
        />
      {:else if type === "m.video"}
        <!-- extensible events have a lot of different places for file size, need to check them all -->
        <Video src={parseMxc(content.url)} size={content.info.size} name={content.body} />
      {:else if type === "m.audio"}
        <Audio src={parseMxc(content.url)} size={content.info.size} name={content.body} />
      {:else if type === "m.file"}
        {@const mime = event.content.info?.mimetype}
        <File src={parseMxc(content.url)} size={content.info.size} name={content.body} />
        <!--
        {#if /text\//.test(mime) || mime === "application/json"}
          <Text src={parseMxc(content.url)} size={content.info.size} name={content.body} />
        {:else}
          <File src={parseMxc(content.url)} size={content.info.size} name={content.body} />
        {/if}
        -->
      {/if}
      {#if event.reactions}
      <MessageReactions {event} />
      {/if}
    </div>
  {/if}
  {/each}
  <input style="opacity: 0; height: 0" autofocus on:paste={e => onfile(e.clipboardData.files[0])} />
</div>
