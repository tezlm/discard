<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import MessageReactions from "./MessageReactions.svelte";
import MessageToolbar from "./MessageToolbar.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { parseMxc, defaultAvatar, calculateHash } from '../../../util/content.js';

// TODO: modularize more, don't require fetching members and stuff

export let event, header = false, shiftKey = false;

let { edit } = state.roomState;
let missingAvs = state.missingAvatars;
let slice = state.slice;
$: toolbar = getToolbar(shiftKey);

let room = state.focusedRoom;
$room.members.fetch();
$: sender = $room.members.get(event.sender) ?? {};

function unwrapEdits(event) {
  while (event.original) event = event.original;
  return event;
}

// amazing logic
function getToolbar(shift = false) {
  const toolbar = [];
  const fromMe = event.sender === state.userId;

  if (event.special) {
    if (event.special === "errored") toolbar.push({ name: "Retry", icon: "r", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "x", clicked: todo });
  } else if (shift) {
    if (fromMe || $room.power.me >= $room.power.getBase("redact")) {
      toolbar.push({ name: "Delete", icon: "x", clicked: () => { event.special = "redacted"; state.api.redactEvent(event.roomId, event.eventId) }});
    }
    if ($room.power.me >= $room.power.getEvent("m.room.message")) {
      toolbar.push({ name: "Reply", icon: ">", clicked: () => state.roomState.reply.set(unwrapEdits(event)) });
    }
    toolbar.push({ name: "Source", icon: "!", clicked: () => state.popup.set({ id: "source", event }) });
  } else {
    if ($room.power.me >= $room.power.getEvent("m.reaction")) {
      toolbar.push({ name: "React", icon: "+", clicked: todo });
    }
    if ($room.power.me >= $room.power.getEvent("m.room.message")) {
      if (fromMe) {
        toolbar.push({ name: "Edit", icon: "_", clicked: () => state.roomState.edit.set(unwrapEdits(event).eventId) });
      } else {
        toolbar.push({ name: "Reply", icon: ">", clicked: () => state.roomState.reply.set(unwrapEdits(event)) });
      }
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

function getColor(sender) {
  if (!sender) return;
  if (state.settings.get("namecolors") === "never") return;
  if (state.settings.get("namecolors") === "power" && $room.power.getUser(sender.userId) === 0) return;
  return `var(--mxid-${calculateHash(sender.userId) % 8 + 1})`
}

function handleClick(e) {
  if (e.altKey) {
    const prev = $slice.events[$slice.events.findIndex(i => i.eventId === event.eventId) - 1];
    if (prev) {
      state.rooms.get(state.focusedRoomId).readEvent = prev.eventId;
      state.slice.set(state.roomSlices.get(state.focusedRoomId));
      state.api.sendReceipt(event.roomId, prev.eventId);
    }
  }
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
  display: inline-block;
  height: 22px;
}

.author:hover {
	text-decoration: underline;
}

.badge {
  display: inline-block;
  padding: 0 4px;

  color: var(--fg-notice);
  background: var(--color-accent);
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 3px;
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
<div class="message" on:click={handleClick}>
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
      <span class="author" style:color={getColor(sender)}>{sender.name || event.sender}</span>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      <span style="margin-right: 0.25rem;"></span>
      <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
    </div>
    {/if}
    {#if event.eventId === $edit}
    <MessageEdit {event} />
    {:else}
    <MessageContent {event} />
    {/if}
    {#if event.reactions}<MessageReactions {event} />{/if}
  </div>
  {#if event.eventId !== $edit}
  <div class="toolbar">
    <MessageToolbar items={toolbar} {event} />
  </div>
  {/if}
</div>