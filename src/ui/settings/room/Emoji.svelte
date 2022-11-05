<script>
import Avatar from "../../atoms/Avatar.svelte";
import Button from "../../atoms/Button.svelte";
import Toolbar from "../../atoms/Toolbar.svelte";
import { parseMxc } from "../../../util/content.ts";
export let room;
let { settings, popup } = state;
</script>
<style>
.pack {
  position: relative;
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-rooms-members);
  border-radius: 4px;
  margin-top: 8px;
}

.header {
  display: flex;
  background: var(--bg-misc);
  padding: 16px;
}

.toolbar {
  position: absolute;
  right: 8px;
  top: 8px;
	display: none;
}

.header:hover .toolbar {
	display: block;
}

.emojis {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.emoji {
  height: 48px;
  width: 48px;
  background: var(--bg-spaces);
  object-fit: contain;
}
</style>
<p>TODO: upload/edit/rename/delete packs</p>
<p>TODO: upload/edit/rename/delete emoji and stickers</p>
<p>TODO: collapsable packs</p>
<p>TODO: use packs globally</p>
<br />
{#each room.getAllState("im.ponies.room_emotes").filter(i => i.content.pack) as event}
{@const pack = event.content.pack}
{@const name = pack.display_name || event.stateKey}
<div class="pack">
  <div class="header">
    <Avatar link user={{ name, id: `${event.room.id}-${event.stateKey}`, avatar: pack.avatar_url }} size={64} />
    <div style="margin-left: 16px; flex: 1">
      <h3>{name}</h3>
      <p>{#if pack.attribution}{pack.attribution}{:else}<i>no attribution</i>{/if}</p>
    </div>
    {#if $settings.get("shadowdev")}
    <div class="toolbar">
      <Toolbar items={[{ clicked: () => $popup = { id: "dev-event", event }, name: "view source", icon: "terminal" }]} />
    </div>
    {/if}
  </div>
  <table class="emojis">
    <tr>
      <th class="title">Image</th>
      <th class="title" style="width: 100%">Shortcode</th>
    </tr>
  {#each Object.entries(event.content.images ?? {}) as [shortcode, emoji]}
    <tr>
      <td>
        <img class="emoji" src={parseMxc(emoji.url)} alt={shortcode} height=64 />
      </td>
      <td>
        <span style:color="var(--fg-dim)">:</span>{shortcode}<span style:color="var(--fg-dim)">:</span>
      </td>
    </tr>
  {:else}
    <div>pack has no emoji</div>
  {/each}
  </table>
</div>
{/each}
<div style="min-height: 64px"></div>
