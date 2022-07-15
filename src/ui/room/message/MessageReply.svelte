<script>
// TODO: make edits apply
import { parseHtml } from "../../../util/html.js";
import { parseMxc, defaultAvatar } from '../../../util/events.js';
export let roomId, eventId;
let missingAvs = state.missingAvatars;
let room = state.focusedRoom;
let eventPromise = state.events.fetch(roomId, eventId);

function getName(sender) {
  const member = $room.members.get(sender);
  if (!member) return member.userId;
  return member.name ?? member.userId;
}

function getAvatar(sender) {
  if (missingAvs.has(sender)) return defaultAvatar;
  const member = $room.members.get(sender);
  if (!member) return defaultAvatar;
  return member.avatar ? parseMxc(member.avatar) : defaultAvatar;
}
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;

  font-size: 14px;
  height: 14px;
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
  margin-left: 4px;
}
</style>
{#await eventPromise}
<div class="reply">loading</div>
{:then event}
<div class="reply">
  <img 
    class="avatar"
    alt="avatar for {getName(event.sender)}"
    src={getAvatar(event.sender)}
    on:error={(e) => { missingAvs.add(event.sender); e.target.src = defaultAvatar }}
  />
  <span class="author">{getName(event.sender)}</span>
  <div class="content" on:click={() => actions.slice.jump(roomId, eventId)}>
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

