<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageToolbar from "./MessageToolbar.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { getDisplayName, getAvatar, defaultAvatar } from '../../../util/events.js';

export let event, header = false;

let missingAvs = state.missingAvatars;
let roomState = state.roomState;
let toolbar = getToolbar(event);

function unwrapEdits(event) {
  while (event.original) event = event.original;
  return event;
}

// TODO: shift key toolbar
function getToolbar(event) {
  let toolbar = [];
  toolbar.push({ name: "Add Reaction", icon: "+", clicked: todo });
  if (event.type === "m.room.message") { // purposefully broken, edit doesnt work yet
    toolbar.push({ name: "Reply", icon: ">", clicked: (ev) => $roomState.reply = unwrapEdits(ev) });
  } else {
    toolbar.push({ name: "Edit", icon: "_", clicked: (ev) => state.editingEvent.set(ev) });
  }
  toolbar.push({ name: "More", icon: "\u22ee", clicked: (ev) => state.popup.set({ id: "source", event: ev })});
  return toolbar;
}

function getReply(content) {
  return content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
}
</script>
<style>
.message {
  display: flex;
  padding: 2px 72px;
  margin-top: 0;
  position: relative;
  color: var(--fg-content);
}

.message:hover {
  background: rgba(4,4,5,0.07);
}

.header {
  margin-top: 14px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.content {
  color: var(--fg-content);
  width: 100%;
  padding: 2px 0;
}

.top {
  margin: .125rem 0;
}

.author {
	font-weight: 500;
	cursor: pointer;
  margin-right: 0.25rem;
  min-height: 22px;
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
  margin-top: 4px;
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
<div class="message" class:header>
  <div class="side">
    {#if getReply(event.content)}<br>{/if}
    {#if header}
    <img
      class="avatar"
      alt="pfp for {getDisplayName(event.sender)}"
      src={missingAvs.has(event.sender) ? defaultAvatar : getAvatar(event.sender, event.roomId)}
      on:error={(e) => { console.log("missing av"); missingAvs.add(event.sender); e.target.src = defaultAvatar }}
    />
    {:else}
    <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.content)}<MessageReply roomId={event.roomId} eventId={getReply(event.content)} />{/if}
    {#if header}
    <div class="top">
      <span class="author">{getDisplayName(event.sender, event.roomId)}</span>
      <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
    </div>
    {/if}
    <MessageContent {event} />
  </div>
  <div class="toolbar">
    <MessageToolbar items={toolbar} {event} />
  </div>
</div>
