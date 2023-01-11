<script>
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import MessageEdit from "./MessageEdit.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import Name from "../../atoms/Name.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
import { formatDate, formatTime } from "../../../util/format.ts";
import { memberContext } from "../../../util/context";
import { fastclick } from "../../../util/use";

export let room, event, header = false;

let { popout, context } = state;
let { edit } = state.roomState;

$: reply = getReply(event);

function getReply(event) {
  return event.content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
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
  padding-left: 0;
}

.content {
  color: var(--fg-content);
  flex: 1;
  max-width: 100%;
  padding-right: 16px;
}

.author {
  display: inline-block;
  height: 22px;
  line-height: 22px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
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
  margin-top: 4px;
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
  on:contextmenu={e => { const memberId = e.target.dataset.mxPing; if (memberId && room.members.has(memberId)) { e.preventDefault(); e.stopPropagation(); showMemberContext(room.members.get(memberId))(e) }}}
>
  <div class="side">
    {#if reply}<div style="height: 22px"></div>{/if}
    {#if header}
    <div
      class="avatar"
      class:selected={$popout._owner === `${event.id}-${event.sender.id}`}
      use:fastclick
      on:fastclick={showMemberPopout}
      on:click|stopPropagation
      on:contextmenu|preventDefault|stopPropagation={showMemberContext(event.sender)}
    >
      <Avatar user={event.sender} size={40} />
    </div>
    {:else}
    <Tooltip tip={event.date.toLocaleString()}>
      <time datetime={event.date.toISOString()}>{formatTime(event.date)}</time>
    </Tooltip>
    {/if}
  </div>
  <div class="content">
    {#if reply}<MessageReply {room} eventId={reply} />{/if}
    {#if header}
    <div>
      <div class="author">
        <Name member={event.sender} />
      </div>
      {#if event.content.msgtype === "m.notice"}
      <div class="badge">bot</div>
      {/if}
      <span style="margin-right: 0.25rem;"></span>
      <Tooltip tip={event.date.toLocaleString()}>
        <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
      </Tooltip>
    </div>
    {/if}
    {#if event.id === $edit}
    <MessageEdit {event} />
    {:else}
    <MessageContent {event} />
    {/if}
  </div>
</div>
