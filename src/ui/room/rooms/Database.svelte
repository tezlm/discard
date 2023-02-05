<script>
import Button from "../../atoms/Button.svelte";
import Input from "../../atoms/Input.svelte";
import VirtualList from "svelte-tiny-virtual-list"
export let room;
const tables = room.getAllState("org.eu.celery.state.database.table");
let focused = tables[0];
$: items = room.events.live.filter(i => i.type === "org.eu.celery.event.database." + focused.stateKey);
let tableHeight;
/*
temp0.sendState("org.eu.celery.state.database.table", {
  name: "artists",
  columns: {
    name: "string",
  },
}, "artists");
temp0.sendState("org.eu.celery.state.database.table", {
  name: "albums",
  columns: {
    name: "string",
    artist: "ref",
  },
  refs: {
    artist: "artists"
  },
}, "albums");
temp0.sendState("org.eu.celery.state.database.table", {
  name: "tracks",
  columns: {
    name: "string",
    length: "number",
    album: "ref",
  },
  refs: {
    album: "albums",
  },
}, "tracks");
*/
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album1", artist: "person1" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album2", artist: "person1" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album3", artist: "person2" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album4", artist: "person2" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album5", artist: "person2" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album6", artist: "person4" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album7", artist: "person4" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album8", artist: "person4" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album9", artist: "person4" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album10", artist: "person5" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album11", artist: "person5" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album12", artist: "person7" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album13", artist: "person8" });
// temp0.sendEvent("org.eu.celery.event.database.albums", { name: "album14", artist: "person8" });
console.log(room, room.getAllState("org.eu.celery.state.database.table"))
</script>
<style>
.main {
  flex: 1;
}

.row {
  display: flex;
  height: 24px;
}

.row > * {
  width: 100px;
}
</style>
<div class="main">
  <div class="row">
    {#each tables as table}
    <button on:click={() => focused = table}>
      {table.content.name}
    </button>
    {/each}
  </div>
  <hr />
  <div bind:clientHeight={tableHeight}>
    <VirtualList
      height={tableHeight}
      width="auto"
      itemCount={items.length}
      itemSize={24}
    >
      <div slot="header" class="row" style="position: sticky; top: 0; z-index: 1; background: var(--bg-content)">
      <div>#</div>
      {#each Object.entries(focused.content.columns) as [name, type]}
      <div>{name}</div>
      {/each}
      </div>
      <div slot="item" class="row" let:index let:style {style}>
        <div>{index}</div>
        {#each Object.entries(focused.content.columns) as [name]}
        <div>{items[index].content[name]}</div>
        {/each}
      </div>
    </VirtualList>
  </div>
</div>

