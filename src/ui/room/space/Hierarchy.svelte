<script>
import Avatar from "../../atoms/Avatar.svelte";
import { parseHtml } from "../../../util/html";
export let item;
const { dms } = state;
const collapsed = {};

// move dm status into the room object?
function getName(room) {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}
</script>
<style>
.expander {
  display: flex;
  margin-left: -6px;
  margin-top: 8px;
  gap: 4px;
  align-items: end;
  font-weight: bold;
  color: var(--fg-muted);
  cursor: pointer;
}

.expander:hover {
  color: var(--fg-notice);
}

.expander .icon {
  transform: rotate(90deg);
  transition: transform .2s;
}

.expander.collapsed .icon {
  transform: rotate(0);
}

.children {
  position: relative;
  border-left: solid var(--color-gray) 2px;
  padding: 0 8px;
  padding-bottom: 1px;
  margin-bottom: 16px;
}

.children::after {
  content: "";
  position: absolute;
  left: -2px;
  bottom: -8px;
  display: block;
  height: 24px;
  width: 24px;
  border-left: solid var(--color-gray) 2px;
  border-bottom: solid var(--color-gray) 2px;
  border-bottom-left-radius: 8px;
}
</style>
{#each item.children as item}
{@const { room } = item}
  {#if room.type === "m.space"}
    <div
      class="expander"
      class:collapsed={collapsed[room.id]}
      on:click={() => collapsed[room.id] = !collapsed[room.id]}
    >
      <div class="icon">chevron_right</div>
      <div>{getName(room)}</div>
      {#if room.topic}
      <div style="color: var(--fg-muted)">{@html parseHtml(room.topic, { linkify: true, twemojify: true, sanitize: true, inline: true })}</div>
      {/if}
    </div>
    {#if !collapsed[room.id]}
    <div class="children">
      {#if item.children.length}
      <svelte:self {item} />
      {:else}
      <div style="color: var(--fg-muted); font-style: italic; padding: 8px 2px">no children</div>
      {/if}
    </div>
    {/if}
  {:else}
    <div style="display: flex; margin: 8px 0">
      <Avatar user={room} size={36} link />
      <div style="margin-left: 12px">
        <div style="font-weight: bold">{getName(room)}</div>
        {#if room.topic}
        <div style="color: var(--fg-muted)">{@html parseHtml(room.topic, { linkify: true, twemojify: true, sanitize: true, inline: true })}</div>
        {:else}
        <div style="color: var(--fg-muted); font-style: italic">no topic</div>
        {/if}
      </div>
    </div>
  {/if}
{/each}
