<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import MessageReactions from "./MessageReactions.svelte";
import MessageToolbar from "./MessageToolbar.svelte";
import Emoji from "../../molecules/Emoji.svelte";
import User from "../../molecules/User.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { parseMxc, defaultAvatar, calculateHash } from '../../../util/content.js';
import { quadOut } from "svelte/easing";

// TODO: modularize more, don't require fetching members and stuff

// reaction picker:
// TODO: share code with MessageReaction.svelte
// TODO: (along with other menus) move into viewport

export let room, event, header = false, shiftKey = false;

let { edit } = state.roomState;
let missingAvs = state.missingAvatars;
let slice = state.slice;
$: toolbar = getToolbar(shiftKey);
$: sender = room.members.get(event.sender) ?? {};

let showReactionPicker = false;
let showUserPopout = false;

function unwrapEdits(event) {
  while (event.original) event = event.original;
  return event;
}

// amazing logic
function getToolbar(shift = false) {
  const toolbar = [];
  const fromMe = event.sender === state.userId;

  if (event.special) {
    if (event.special === "errored") toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shift && !showReactionPicker) {
    if (fromMe || room.power.me >= room.power.getBase("redact")) {
      toolbar.push({ name: "Delete", icon: "delete", color: "var(--color-red)", clicked: () => { event.special = "redacted"; state.api.redactEvent(event.roomId, event.eventId) }});
    }
    if (room.power.me >= room.power.getEvent("m.room.message")) {
      toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(unwrapEdits(event)) });
    }
    toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "source", event }) });
  } else {
    if (room.power.me >= room.power.getEvent("m.reaction")) {
      toolbar.push({ name: "React", icon: "add_reaction", clicked: () => showReactionPicker = !showReactionPicker });
    }
    if (room.power.me >= room.power.getEvent("m.room.message")) {
      if (fromMe) {
        toolbar.push({ name: "Edit", icon: "edit", clicked: () => state.roomState.edit.set(unwrapEdits(event).eventId) });
      } else {
        toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(unwrapEdits(event)) });
      }
    }
    toolbar.push({ name: "More", icon: "more_vert", clicked: todo });
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
  if (state.settings.get("namecolors") === "power" && room.power.getUser(sender.userId) === 0) return;
  return `var(--mxid-${calculateHash(sender.userId) % 8 + 1})`
}

function handleClick(e) {
  if (e.altKey) {
    const prev = $slice.events[$slice.events.findIndex(i => i.eventId === event.eventId) - 1];
    if (prev) {
      room.readEvent = prev.eventId;
      state.slice.set(state.roomSlices.get(state.focusedRoomId));
      state.api.sendReceipt(event.roomId, prev.eventId);
    }
  }
}

function fly(_, props) {
  return {
    duration: 200,
    easing: quadOut,
    css: t => `transform: translateX(${t * props.x - props.x}px)`,
  };
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
  position: relative;
  padding: 0 4px;
  bottom: 2px;

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
  object-fit: cover;
  background-color: var(--bg-spaces);
  box-shadow: 0 0 0 #00000022;
  cursor: pointer;
  user-select: none;
  transition: all .2s;
}

.avatar:hover, .avatar.selected {
  box-shadow: 0 4px 4px #00000022;
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
  align-items: start;
  position: absolute;
  right: 1rem;
  top: -16px;
  z-index: 1;
}

.reaction-picker {
  margin-right: 8px;
}

.message:hover time {
  display: inline-block;
}

.message:hover .toolbar {
  display: flex;
}

.message .user {
  position: absolute;
  z-index: 1;
}
</style>
<div class="message" on:click={handleClick}>
  <div class="side">
    {#if getReply(event.content)}<div style="height: 22px"></div>{/if}
    {#if header}
    <img
      class="avatar"
      class:selected={showUserPopout}
      alt="pfp for {sender.name ?? event.sender}"
      src={getAvatar()}
      on:click={(e) => { e.stopImmediatePropagation(); showUserPopout = !showUserPopout }}
      on:error={(e) => { missingAvs.add(sender.userId); e.target.src = defaultAvatar }}
    />
    {:else}
    <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.content)}<MessageReply {room} eventId={getReply(event.content)} />{/if}
    {#if header}
    <div class="top">
      <span class="author" style:color={getColor(sender)} on:click={(e) => { e.stopImmediatePropagation(); showUserPopout = !showUserPopout }}>{sender.name || event.sender}</span>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      {#if showUserPopout}
      <div
        class="user"
        style:top="{getReply(event.content) ? 24 : 0}px"
        in:fly={{ x: -15 }}
      >
        <User user={sender} />
      </div>
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
    {#if event.reactions}<MessageReactions {event} {room} />{/if}
  </div>
  {#if event.eventId !== $edit}
  <div class="toolbar" style:display={showReactionPicker ? "flex" : null}>
    {#if showReactionPicker}
    <div class="reaction-picker" in:fly={{ x: 15 }}>
      <Emoji selected={(emoji, keep) => {
        if (!event.reactions?.get(emoji)?.mine && emoji) {
          const reaction = {
            "m.relates_to": {
              key: emoji,
              rel_type: "m.annotation",
              event_id: event.eventId,
            },
          };
          state.api.sendEvent(event.roomId, "m.reaction", reaction, Math.random());  
        }
        if (!keep) showReactionPicker = false;
      }} />
    </div>
    {/if}
    <MessageToolbar items={toolbar} {event} />
  </div>
  {/if}
</div>
<svelte:window on:click={() => { showReactionPicker = false; showUserPopout = false }} />
