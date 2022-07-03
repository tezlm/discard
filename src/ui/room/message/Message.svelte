<script>
import Timestamp from "../../atoms/Timestamp.svelte";
import MessageReply from "./MessageReply.svelte";
import MessageContent from "./MessageContent.svelte";
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import { getDisplayName, getAvatar, defaultAvatar } from '../../../util/events.js';

export let event, header = false;
let showTimestamp = false;

function getReply(content) {
  return content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
}
</script>
<style>
.message {
  display: flex;
  padding: .125rem 72px;
  margin-top: 0;
  position: relative;
  color: var(--fg-content);
}

.message:hover {
  background: rgba(4,4,5,0.07);
}

.header {
  margin-top: 1em;
  padding-top: .25rem;
}

.content {
  color: var(--fg-content);
  width: 100%;
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
  width: 40px;
  filter: drop-shadow(0, 4px, 4px, #00000022);
}
</style>
<div class="message {header ? 'header' : ''}" on:mouseover={() => showTimestamp = true} on:mouseleave={() => showTimestamp = false}>
  <div class="side">
    {#if getReply(event.getContent())}<br>{/if}
    {#if header}
    <img class="avatar" alt="avatar for {getDisplayName(event.getSender())}" src={getAvatar(event.getSender())} onerror="this.src='{defaultAvatar}'" />
    {:else}
    <Timestamp time={event.getDate()} format="time" display={showTimestamp ? "inline" : "none"} />
    {/if}
  </div>
  <div class="content">
    {#if getReply(event.getContent())}<MessageReply roomid={event.getRoomId()} eventid={getReply(event.getContent())} />{/if}
    {#if header}
    <span class="author">{getDisplayName(event.getSender())}</span>
    <Timestamp time={event.getDate()} format="date" />
    {/if}
    <MessageContent event={event} />
  </div>
</div>
