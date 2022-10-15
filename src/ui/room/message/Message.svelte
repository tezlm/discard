<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
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

let showReactionPicker = false;
let showUserPopout = false;
let context = state.context;

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

.message:hover time {
  display: inline-block;
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
  </div>
</div>
<svelte:window on:click={() => { showReactionPicker = false; showUserPopout = false; }} />
