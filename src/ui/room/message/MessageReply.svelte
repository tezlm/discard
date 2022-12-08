<script>
import Name from "../../atoms/Name.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import { parseHtml } from "../../../util/html";
import { fastclick } from "../../../util/use";
export let room, eventId;
let eventPromise = room.events.fetch(eventId);
</script>
<style>
.reply {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
  margin-right: 16px;
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
  margin-right: .33rem;
}

.content {
  flex: 1;
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
  position: relative;
  color: var(--color-accent);
  font-weight: 500;
  padding: 0 2px;
  cursor: pointer;
}

.content :global([data-mx-ping]::after) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  background: var(--color-accent);
  opacity: .1;
}

.content :global([data-mx-ping="room"]) {
  color: var(--color-purple);
}

.content :global([data-mx-ping="room"]::after) {
  background: var(--color-purple);
}

.content :global([data-mx-ping]:hover::after) {
  opacity: .2;
}
</style>
{#await eventPromise}
<div class="reply">loading</div>
{:then event}
<div class="reply">
  <div class="avatar">
    <Avatar user={event.sender} size={16} />
  </div>
  <span class="author">
    <Name light member={event.sender} />
  </span>
  <div class="content" use:fastclick on:fastclick={() => actions.slice.jump(event.room.id, event.id)}>
    {#if !event.content?.body.trim()}
      <i style="color: var(--fg-muted)">no content?</i>
    {:else if event.content.format === "org.matrix.custom.html"}
      {@const html = parseHtml(event.content.formatted_body, { linkify: true, sanitize: true, inline: true }).replace(/\n|<br.*?>/g, " ")}
      {#if html}
        {@html html}
      {:else}
        <i style="color: var(--fg-muted)">no content?</i>
      {/if}
    {:else if event.content.body}
      {event.content.body.replace(/\n/g, " ")}
    {:else}
      <i style="color: var(--fg-muted)">failed to render {event.type} event</i>
    {/if}
  </div>
</div>
{:catch err}
<div class="reply">error: {err.error ?? JSON.stringify(err)}</div>
{/await}
