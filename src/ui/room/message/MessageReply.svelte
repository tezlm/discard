<script>
// TODO: make edits apply
import { parseHtml } from "../../../util/html.js";
import { calculateHash } from '../../../util/content.js';
import Avatar from "../../atoms/Avatar.svelte";
export let room, eventId;
let eventPromise = state.events.fetch(room, eventId);
let settings = state.settings;

function getColor(sender) {
  if (!sender) return;
  if ($settings.get("namecolors") === "never") return;
  if ($settings.get("namecolors") === "power" && room.power.getUser(sender.userId) === 0) return;
  return `var(--mxid-${calculateHash(sender.userId) % 8 + 1})`
}
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
  height: 14px;

  font-size: 14px;
  color: var(--fg-light);
  white-space: nowrap;
}

.reply::before {
  content: "";
  border-top: solid var(--color-gray-light) 2px;
  border-left: solid var(--color-gray-light) 2px;
  border-top-left-radius: 6px;
  position: absolute;
  left: -38px;
  top: 6px;
  height: 10px;
  width: 30px;
}

.reply .author {
  filter: brightness(0.9);
  margin-right: .25rem;
  cursor: pointer;
}

.reply .author:hover {
  text-decoration: underline;
}

.reply .avatar {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: .25rem;
}

.content {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.content:hover {
  color: var(--fg-notice);
}

.content :global(a) {
  pointer-events: none;
}

.content :global(h1),
.content :global(h2),
.content :global(h3),
.content :global(h4),
.content :global(h5),
.content :global(h6) {
  font-size: 1em;
}

.content > :global(*) {
  display: inline;
}

.content :global([data-mx-ping]) {
  color: var(--fg-notice);
  font-weight: 500;
  background: var(--ping-bgalpha);
  padding: 0 2px;
  border-radius: 3px;
}
</style>
{#await eventPromise}
<div class="reply">loading</div>
{:then event}
<div class="reply">
  <div class="avatar">
    <Avatar mxc={event.sender.avatar} size={16} />
  </div>
  <span class="author" style:color={getColor(event.sender)}>{event.sender.name || event.sender.userId}</span>
  <div class="content" on:click={() => actions.slice.jump(event.roomId, event.eventId)}>
    {#if event.content.format === "org.matrix.custom.html"}
      {@html parseHtml(event.content.formatted_body, { linkify: true, sanitize: true, inline: true }).replace(/\n|<br.*?>/g, " ")}
    {:else}
      {event.content.body.replace(/\n/g, " ")}
    {/if}
  </div>
</div>
{:catch err}
<div class="reply">error: {err}</div>
{/await}
