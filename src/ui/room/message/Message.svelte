<script>
// TODO: fix timestamp vertical alignment
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import { formatDate, formatTime } from "../../../util/format.js";
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import { getDisplayName, getAvatar, defaultAvatar } from '../../../util/events.js';

export let event, header = false;
let time = event.getDate();

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
  margin-top: 1rem;
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
  margin-right: 8px;
}

.avatar {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  filter: drop-shadow(0, 4px, 4px, #00000022);
}

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-display);
  text-align: right;
  display: none;
}

.message:hover time {
  display: inline-block;
}
</style>
<div class="message {header ? 'header' : ''}">
  <div class="side">
    {#if getReply(event.getContent())}<br>{/if}
    {#if header}
    <img class="avatar" alt="avatar for {getDisplayName(event.getSender())}" src={getAvatar(event.getSender())} onerror="this.src='{defaultAvatar}'" />
    {:else}
    <time datetime={time.toISOString()}>{formatTime(time)}</time>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.getContent())}<MessageReply roomid={event.getRoomId()} eventid={getReply(event.getContent())} />{/if}
    {#if header}
    <div class="top">
      <span class="author">{getDisplayName(event.getSender())}</span>
      <time datetime={time.toISOString()} style="display: inline">{formatDate(time)}</time>
    </div>
    {/if}
    <MessageContent event={event} />
  </div>
</div>
