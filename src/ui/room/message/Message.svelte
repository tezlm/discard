<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import MessageReactions from "./MessageReactions.svelte";
import MessageToolbar from "../../atoms/Toolbar.svelte";
import User from "../../molecules/User.svelte";
import { formatDate, formatTime } from "../../../util/format.ts";
import { calculateHash } from '../../../util/content.ts';
import { quadOut } from "svelte/easing";
import Avatar from "../../atoms/Avatar.svelte";
import { eventContext, memberContext } from "../../../util/context";

export let room, event, header = false, shiftKey = false;

let { edit } = state.roomState;
let slice = state.slice;
let settings = state.settings;
let toolbarEl;
$: toolbar = getToolbar(shiftKey);

let showReactionPicker = false;
let showUserPopout = false;
let context = state.context;

// amazing logic
function getToolbar(shift = false) {
  const toolbar = [];
  const fromMe = event.sender.userId === state.userId;

  if (event.flags?.has("errored")) {
    toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (event.flags?.has("sending")) {
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shift && !showReactionPicker) {
    if (fromMe || room.power.me >= room.power.getBase("redact")) {
      toolbar.push({ name: "Delete", icon: "delete", color: "var(--color-red)", clicked: () => { event.special = "redacted"; state.api.redactEvent(event.roomId, event.eventId) }});
    }
    if (room.power.me >= room.power.getEvent("m.room.message")) {
      toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
    }
    toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
  } else {
    if (room.power.me >= room.power.getEvent("m.reaction")) {
      toolbar.push({ name: "React", icon: "add_reaction", clicked: () => showReactionPicker = !showReactionPicker });
    }
    if (room.power.me >= room.power.getEvent("m.room.message")) {
      if (fromMe) {
        toolbar.push({ name: "Edit", icon: "edit", clicked: () => state.roomState.edit.set(event.id) });
      } else {
        toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
      }
    }
    toolbar.push({ name: "More", icon: "more_vert", clicked: showMore });
  }

  return toolbar;

  function showMore() {
    const rect = toolbarEl.getBoundingClientRect();
    if ($context.items) return $context = {};
    $context = { items: eventContext(event, { showEmoji: () => showReactionPicker = true }), x: rect.left, y: rect.top + 40 };
  }
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
      room.accountData.set("m.fully_read", { event_id: prev.eventId });
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

let popout = state.popout;
$: if (showReactionPicker) {
  queueMicrotask(() => {
    const rect = toolbarEl.getBoundingClientRect();
    state.popout.set({
      id: "emoji",
      animate: "left",
      top: rect.top,
      right: window.innerWidth - rect.left + 8,
      selected(emoji, keepOpen) {
        if (emoji && !event.reactions?.get(emoji)?.find(i => i.sender.id === state.userId)) {
          const reaction = {
            "m.relates_to": {
              key: emoji,
              rel_type: "m.annotation",
              event_id: event.id,
            },
          };
          state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
        }
        if (!keepOpen) showReactionPicker = false;
      },
    });  
  });
} else {
  state.popout.set({});
}
</script>
<style>
.message {
  display: flex;
  padding: 2px 72px 4px;
  position: relative;
  color: var(--fg-content);
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
  transition: box-shadow .2s;
}

.avatar:hover, .avatar.selected {
  box-shadow: 0 4px 4px #00000022;
}

.avatar:active {
  transform: translateY(1px);
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
    <div class="avatar" class:selected={showUserPopout} on:click|stopPropagation={() => showUserPopout = !showUserPopout} on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: memberContext(event.sender), x: e.clientX, y: e.clientY })}>
      <Avatar user={event.sender} size={40} />
    </div>
    {:else}
    <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.content)}<MessageReply {room} eventId={getReply(event.content)} />{/if}
    {#if header}
    <div class="top">
      <span class="author" style:color={getColor(event.sender, $settings)} on:click|stopPropagation={() => state.popup.set({ id: "user", userId: event.sender.id })} on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: memberContext(event.sender), x: e.clientX, y: e.clientY })}>{event.sender.name || event.sender.id}</span>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      {#if showUserPopout}
      <div
        class="user"
        style:top="{getReply(event.content) ? 24 : 0}px"
        in:fly={{ x: -15 }}
        on:click={(e) => e.stopPropagation()}
      >
        <User member={event.sender} />
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
    {#if event.reactions}<MessageReactions {event} />{/if}
    <!-- {event.relations.filter(i => i.content["m.relates_to"]?.rel_type === "m.thread").length} thread replies -->
  </div>
  {#if event.id !== $edit}
  <div class="toolbar" bind:this={toolbarEl} style:display={showReactionPicker ? "block" : null}>
    <MessageToolbar items={toolbar} />
  </div>
  {/if}
</div>
<svelte:window on:click={() => { showReactionPicker = false; showUserPopout = false; }} />
