<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import User from "../../molecules/User.svelte";
import { formatDate, formatTime } from "../../../util/format.ts";
import { quadOut } from "svelte/easing";
import Avatar from "../../atoms/Avatar.svelte";
import Name from "../../atoms/Name.svelte";
import { memberContext } from "../../../util/context";

export let room, event, header = false;

let { edit } = state.roomState;
let showUserPopout = false;

function getReply(content) {
  return content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
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
  display: inline-block;
  height: 22px;
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
  margin-top: 2px;
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
<div class="message">
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
    <div>
      <div class="author">
        <Name member={event.sender} />
      </div>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      {#if showUserPopout}
      <div
        class="user"
        style:top="{getReply(event.content) ? 24 : 0}px"
        in:fly={{ x: -15 }}
        on:click|stopPropagation
      >
        <User member={event.sender} />
      </div>
      {/if}
      <span style="margin-right: 0.25rem;"></span>
      <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
    </div>
    {/if}
    {#if event.id === $edit}
    <MessageEdit {event} />
    {:else}
    <MessageContent {event} />
    {/if}
  </div>
</div>
<svelte:window on:click={() => { showUserPopout = false; }} />
