<script>
import Timestamp from "../../atoms/Timestamp.svelte";
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import { getDisplayName, getAvatar } from '../../../util/events.js';

export let event, header = false;
export let timestamp;

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
  margin-top: 1em;
}

.content {
  color: var(--fg-content);
}

.author {
	font-weight: bold;
	cursor: pointer;
  margin-right: 0.25rem;
}

.author:hover {
	text-decoration: underline;
}

.side {
  position: absolute;
  display: inline-block;
  left: 16px;
  margin-right: 8px;
}

.avatar {
  border-radius: 50%;
  height: 40px;
}

.message:hover .timestamp, .timestamp.inline {
  display: inline;
}

:global(a) {
  color: #00aff4;
  text-decoration: none;
}

:global(a:hover) {
  text-decoration: underline;
}
</style>
<div class="message {header ? 'header' : ''}">
  <div class="side">
    {#if getReply(event.getContent())}<br>{/if}
    {#if header}
    <img class="avatar" alt="avatar for {getDisplayName(event.getSender())}" src={getAvatar(event.getSender())} />
    {:else}
    <Timestamp time={timestamp} format="time" display="none"/>
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.getContent())}<MessageReply roomid={event.getRoomId()} eventid={getReply(event.getContent())} />{/if}
    {#if header}
    <span class="author">{getDisplayName(event.getSender())}</span>
    <Timestamp time={timestamp} format="date" />
    {/if}
    <MessageContent event={event} />
  </div>
</div>
