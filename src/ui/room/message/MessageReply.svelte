<script>
// TODO: make edits apply
import { parseHtml } from "../../../util/html.js";
import { getDisplayName, getAvatar } from '../../../util/events.js';
export let roomId, eventId;
let eventPromise = state.timeline.find(i => i.id === eventId) ?? state.client.fetchRoomEvent(roomId, eventId);
// NOTE: this technically works due to properties used, but it would be better to get an actual discard event instead
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;
  bottom: 4px;

  white-space: nowrap;

  font-size: 14px;
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
  <img class="avatar" src={getAvatar(event.sender)} /><span class="author">{getDisplayName(event.sender)}</span>
  <div class="content" on:click={() => actions.slice.jump(roomId, eventId)}>
    {#if event.content.format === "org.matrix.custom.html"}
      <div style="pointer-events:none">{@html parseHtml(event.content.formatted_body).split(/<br|\r?\n/)[0]}</div>
    {:else}
      {event.content.body.split(/\r?\n/)[0]}
    {/if}
  </div>
</div>
{:catch}
<div class="reply">error!</div>
{/await}

