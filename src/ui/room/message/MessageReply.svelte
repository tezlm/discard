<script>
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import { getDisplayName, getAvatar } from '../../../util/events.js';
export let roomid, eventid;
let eventPromise = state.client.fetchRoomEvent(roomid, eventid);
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;
  bottom: 4px;
  font-size: 14px;
  text-overflow: elipsis;
  color: var(--fg-light);
}

.reply::before {
  content: "";
  border-top: solid gray 2px;
  border-left: solid gray 2px;
  border-top-left-radius: 6px;
  position: absolute;
  left: -38px;
  top: 10px;
  height: 8px;
  width: 30px;
}

.reply::after {
  content: "a";
  visibility: hidden;
}

.reply .author {
  font-weight: bold;
  margin-right: .25rem;
}

.reply .avatar {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin-right: .25rem;
}
</style>
{#await eventPromise then event}
<div class="reply">
  <img class="avatar" src={getAvatar(event.sender)} /><span class="author">{getDisplayName(event.sender)}</span>
  {#if event.content.format === "org.matrix.custom.html"}{@html sanitizeMatrixHtml(event.content.formatted_body)}{:else}{event.content.body}{/if}
</div>
{/await}
