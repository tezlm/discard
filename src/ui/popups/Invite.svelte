<script>
import Input from "../atoms/Input.svelte";
import Search from "../atoms/Search.svelte";
import Popup from "../atoms/Popup.svelte";
export let current;

function getLink() {
  if (current.room.joinRule !== "public") return null;
  const alias = current.room.getState("m.room.canonical_alias")?.content.alias;
  if (alias) {
    return `https://matrix.to/#/${encodeURIComponent(alias)}`;
  } else {
    const servers = current.room.members
      .with("join")
      .slice(0, 100)
      .map(i => i.id.slice(i.id.indexOf(":") + 1));
    return `https://matrix.to/#/${encodeURIComponent(current.room.id)}?via=${[...new Set(servers)].slice(0, 5).join(",")}`;
  }
}
</script>
<style>
.split-top {
  box-shadow: var(--shadow-header);
  margin: 0 -16px;
  margin-top: 16px;
  height: 3px;
}

.split-btm {
  border-top: solid var(--bg-rooms-members) 1px;
  margin: 0 -16px;
  margin-bottom: 16px;
}
</style>
<Popup>
  <h3 slot="header">Invite friends to {current.room.name}</h3>
  <div slot="content">
    <Search placeholder="Search for people" size="tall" />
    <div class="split-top"></div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <h2 style="text-align: center; font-size: 18px" class="title">No results :(</h2>
    <br />
    <br />
    <br />
    <br />
    <br />
    {#if getLink()}
    <div class="split-btm"></div>
    <div class="title">Or, send a link</div>
    <Input value={getLink()} autofocus />
    {/if}
  </div>
</Popup>

