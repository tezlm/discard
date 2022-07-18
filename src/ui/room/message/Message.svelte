<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageReactions from "./MessageReactions.svelte";
import MessageToolbar from "./MessageToolbar.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { parseMxc, defaultAvatar, calculateHash } from '../../../util/content.js';

export let event, header = false, shiftKey = false;

let missingAvs = state.missingAvatars;
$: toolbar = getToolbar(event, shiftKey);

let room = state.focusedRoom;
$room.members.fetch();
$: sender = $room.members.get(event.sender) ?? {};

function unwrapEdits(event) {
  while (event.original) event = event.original;
  return event;
}

// amazing logic
function getToolbar(event, shift = false) {
  const toolbar = [];
  const fromMe = event.sender === state.userId;

  if (event.special) {
    if (event.special === "errored") toolbar.push({ name: "Retry", icon: "r", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "x", clicked: todo });
  } else if (shift) {
    if (fromMe || $room.power.me >= $room.power.getBase("redact")) {
      toolbar.push({ name: "Delete", icon: "x", clicked: (ev) => { ev.special = "redacted"; state.api.redactEvent(ev.roomId, ev.eventId) }});
    }
    toolbar.push({ name: "Reply", icon: ">", clicked: (ev) => state.roomState.reply.set(unwrapEdits(ev)) });
    toolbar.push({ name: "Source", icon: "!", clicked: (ev) => state.popup.set({ id: "source", event: ev }) });
  } else {
    toolbar.push({ name: "React", icon: "+", clicked: todo });
    if (fromMe) {
      toolbar.push({ name: "Edit", icon: "_", clicked: (ev) => state.roomState.edit.set(unwrapEdits(ev).eventId) });
    } else {
      toolbar.push({ name: "Reply", icon: ">", clicked: (ev) => state.roomState.reply.set(unwrapEdits(ev)) });
    }
    toolbar.push({ name: "More", icon: "\u22ee", clicked: todo });
  }

  return toolbar;
}

function getReply(content) {
  return content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
}

function getAvatar() {
  if (missingAvs.has(sender.userId)) return defaultAvatar;
  return sender.avatar ? parseMxc(sender.avatar, 40) : defaultAvatar;
}
</script>
<style>
.message {
  display: flex;
  padding: 2px 72px 4px;
  position: relative;
  color: var(--fg-content);
  user-select: text;
}

.message:hover {
  background: rgba(4,4,5,0.07);
}

.content {
  color: var(--fg-content);
  width: 100%;
}

.author {
	font-weight: 500;
	cursor: pointer;
  margin-right: 0.25rem;
  display: inline-block;
  height: 22px;
}

.author:hover {
	text-decoration: underline;
}

.side {
  position: absolute;
  display: block;
  left: 16px;
  top: 2px;
}

.avatar {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  background-color: var(--bg-spaces);
  object-fit: cover;
  filter: drop-shadow(0, 4px, 4px, #00000022);
  user-select: none;
}

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  text-align: right;
  display: none;
}

.toolbar {
  display: none;
}

.message:hover time {
  display: inline-block;
}

.message:hover .toolbar {
  display: block;
}
</style>
<div class="message">
  <div class="side">
    {#if getReply(event.content)}<div style="height: 22px"></div>{/if}
    {#if header}
    <img
      class="avatar"
      alt="pfp for {sender.name ?? event.sender}"
      src={getAvatar()}
      on:error={(e) => { missingAvs.add(sender.userId); e.target.src = defaultAvatar }}
    />
    {:else}
    <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.content)}<MessageReply roomId={event.roomId} eventId={getReply(event.content)} />{/if}
    {#if header}
    <div class="top">
      <span class="author" style:color="var(--mxid-{calculateHash(event.sender) % 8 + 1})">{sender.name ?? event.sender}</span>
      <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
    </div>
    {/if}
    <MessageContent {event} />
    {#if event.reactions}<MessageReactions {event} />{/if}
  </div>
  <div class="toolbar">
    <MessageToolbar items={toolbar} {event} />
  </div>
</div>