<script>
// TODO: make edits apply
import { parseHtml } from "../../../util/html.js";
import { getDisplayName, getAvatar, defaultAvatar } from '../../../util/events.js';
export let roomId, eventId;
let missingAvs = state.missingAvatars;
let eventPromise = state.timeline.find(i => i.eventId === eventId) ?? state.client.fetchRoomEvent(roomId, eventId);
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;
  bottom: 4px;

  white-space: nowrap;

  font-size: 14px;
  height: 14px;
  color: var(--fg-light);
}

.reply::before {
  content: "";
  border-top: solid var(--color-gray-light) 2px;
  border-left: solid var(--color-gray-light) 2px;
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
  cursor: pointer;
}

.reply .author:hover {
  text-decoration: underline;
}

.reply .avatar {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin-right: .25rem;
  background: var(--bg-spaces);
}

.reply .content {
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.reply .content:hover {
  color: var(--fg-notice);
}

.reply :global(h1),
.reply :global(h2),
.reply :global(h3),
.reply :global(h4),
.reply :global(h5),
.reply :global(h6) {
  font-size: 1em;
}
</style>
{#await eventPromise}
<div class="reply">loading</div>
{:then event}
<div class="reply">
  <img 
    class="avatar"
    alt="avatar for {getDisplayName(event.sender)}"
    src={missingAvs.has(event.sender) ? defaultAvatar : getAvatar(event.sender, event.roomId)}
    on:error={(e) => { missingAvs.add(event.sender); e.target.src = defaultAvatar }}
  />
  <span class="author">{getDisplayName(event.sender)}</span>
  <div class="content" on:click={() => actions.slice.jump(roomId, eventId)}>
    {#if event.content.format === "org.matrix.custom.html"}
      <div style="pointer-events:none">{@html parseHtml(event.content.formatted_body, { linkify: true, sanitize: true, inline: true }).replace(/\n/g, " ")}</div>
    {:else}
      {event.content.body.replace(/\n/g, " ")}
    {/if}
  </div>
</div>
{:catch}
<div class="reply">error!</div>
{/await}

