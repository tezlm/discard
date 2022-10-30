<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import { formatDate, formatTime } from "../../../util/format.ts";
import { quadOut } from "svelte/easing";
import Avatar from "../../atoms/Avatar.svelte";
import Name from "../../atoms/Name.svelte";
import { memberContext } from "../../../util/context";
import { fastclick } from "../../../util/use";

export let room, event, header = false;

let { popout, context } = state;
let { edit } = state.roomState;

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

const showMemberPopout = (e) => { 
  const rect = e.target.getBoundingClientRect();
  const _owner = `${event.id}-${event.sender.id}`;
  if ($popout._owner === _owner) return $popout = {};
  $popout = {
    id: "member",
    member: event.sender,
    animate: "right",
    top: rect.y,
    left: rect.x + rect.width + 8,
    _owner,
  };
}

const showMemberContext = (member) => (e) => {
  $context = {
    items: memberContext(member),
    x: e.clientX,
    y: e.clientY
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
</style>
<div
  class="message"
  on:contextmenu={e => { const memberId = e.target.dataset.mxPing; if (memberId && room.members.has(memberId)) { e.preventDefault(); e.stopPropagation(); showMemberContext(room.members.get(memberId)) }}}
>
  <div class="side">
    {#if getReply(event.content)}<div style="height: 22px"></div>{/if}
    {#if header}
    <div
      class="avatar"
      class:selected={$popout._owner === `${event.id}-${event.sender.id}`}
      use:fastclick
      on:fastclick={showMemberPopout}
      on:contextmenu|preventDefault|stopPropagation={showMemberContext(event.sender)}
    >
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
