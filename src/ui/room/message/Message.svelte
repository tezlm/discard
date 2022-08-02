<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import MessageReactions from "./MessageReactions.svelte";
import MessageToolbar from "./MessageToolbar.svelte";
import Emoji from "../../molecules/Emoji.svelte";
import User from "../../molecules/User.svelte";
import Context from "../../atoms/Context.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { calculateHash } from '../../../util/content.js';
import { quadOut } from "svelte/easing";
import Avatar from "../../atoms/Avatar.svelte";

// TODO: modularize more, don't require fetching members and stuff

// reaction picker:
// TODO: share code with MessageReaction.svelte
// TODO: (along with other menus) move into viewport

export let room, event, header = false, shiftKey = false;

let { edit } = state.roomState;
let slice = state.slice;
let settings = state.settings;
$: toolbar = getToolbar(shiftKey);

let showReactionPicker = false;
let showUserPopout = false;
let contextMenu = null;

function unwrapEdits(event) {
  while (event.original) event = event.original;
  return event;
}

// amazing logic
function getToolbar(shift = false) {
  const toolbar = [];
  const fromMe = event.sender.userId === state.userId;

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

function getColor(sender, settings) {
  const level = settings.get("namecolors");
  if (!sender) return;
  if (level === "never") return `var(--fg-content)`;
  if (level === "power" && sender.power <= (room.power.users_default ?? 0)) return `var(--fg-content)`;
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

function getContextMenu() {
  const menu = [];
  menu.push({ label: "Add Reaction", clicked: showPicker, submenu: [
    { label: "thumbsup",   clicked: (e) => addReaction(e, "👍️"), icon: "👍️" },
    { label: "thumbsdown", clicked: (e) => addReaction(e, "👎️"), icon: "👎️" },
    { label: "eyes",       clicked: (e) => addReaction(e, "👀"), icon: "👀" },
    { label: "sparkles",   clicked: (e) => addReaction(e, "✨"), icon: "✨" },
    { label: "Other Reactions", icon: "add_reaction", clicked: showPicker },
  ] });
  if (room.power.me >= room.power.getEvent("m.room.message")) {
    if (event.sender.userId === state.userId) menu.push({ label: "Edit Message", icon: "edit", clicked: () => state.roomState.edit.set(unwrapEdits(event).eventId) });
    menu.push({ label: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(unwrapEdits(event)) });
  }
  menu.push({ label: "Mark Unread", icon: "mark_chat_unread", clicked: markUnread });
  menu.push({ label: "Copy Link",   icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${room.roomId}/${event.eventId}`) });
  if ((room.power.me >= room.power.getEvent("m.room.redaction") && event.sender.userId === state.userId) || (room.power.me >= room.power.getBase("redact"))) {
    menu.push({ label: "Delete Message", icon: "delete", color: "var(--color-red)", clicked: () => { event.special = "redacted"; state.api.redactEvent(event.roomId, event.eventId) } });
  }
  menu.push(null);
  menu.push({ label: "View Source", icon: "terminal", clicked: () => state.popup.set({ id: "source", event }) });
  return menu;

  function showPicker(e) {
    e.stopImmediatePropagation();
    contextMenu = null;
    showReactionPicker = true;
  }

  function addReaction(e, emoji) {
    e.stopImmediatePropagation();
    contextMenu = null;
    if (!event.reactions?.get(emoji)?.mine) {
      const reaction = {
        "m.relates_to": {
          key: emoji,
          rel_type: "m.annotation",
          event_id: event.eventId,
        },
      };
      state.api.sendEvent(event.roomId, "m.reaction", reaction, Math.random());  
    }
  }

  function markUnread() {
    const timeline = state.roomTimelines.get(room.roomId).current;
    const index = timeline.lastIndexOf(event.eventId);
    const lastId = timeline[index - 1] ?? event.eventId;
    state.log.debug(`mark ${lastId} as read`);
    state.rooms.get(room.roomId).readEvent = lastId;
    state.slice.set(state.roomSlices.get(room.roomId));
    state.api.sendReceipt(room.roomId, lastId);
  }
}
</script>
<style>
.message {
  display: flex;
  padding: 2px 72px 4px;
  position: relative;
  color: var(--fg-content);
}

.message:hover {
  background: var(--mod-darken);
}

.content {
  color: var(--fg-content);
  width: 100%;
}

.author {
	font-weight: 500;
  display: inline-block;
  height: 22px;
  user-select: text;
	cursor: pointer;
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
  box-shadow: 0 0 0 #00000022;
  cursor: pointer;
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
  user-select: text;
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
<div class="message" on:click={handleClick} on:contextmenu={e => { return; e.preventDefault(); contextMenu = { x: e.clientX, y: e.clientY }}}>
  <div class="side">
    {#if getReply(event.content)}<div style="height: 22px"></div>{/if}
    {#if header}
    <div class="avatar" class:selected={showUserPopout} on:click={(e) => { e.stopImmediatePropagation(); showUserPopout = !showUserPopout }}>
      <Avatar mxc={event.sender.avatar} size={40} />
    </div>
    {:else}
    <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.content)}<MessageReply {room} eventId={getReply(event.content)} />{/if}
    {#if header}
    <div class="top">
      <span class="author" style:color={getColor(event.sender, $settings)} on:click={(e) => { e.stopImmediatePropagation(); showUserPopout = !showUserPopout }}>{event.sender.name || event.sender.userId}</span>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      {#if showUserPopout}
      <div
        class="user"
        style:top="{getReply(event.content) ? 24 : 0}px"
        in:fly={{ x: -15 }}
      >
        <User user={event.sender} />
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
{#if contextMenu}
<Context x={contextMenu.x} y={contextMenu.y} items={getContextMenu()} />
{/if}
<svelte:window on:click={() => { showReactionPicker = false; showUserPopout = false; contextMenu = null }} />
