<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import Search from "../atoms/Search.svelte";
import { highlight } from "prismjs";
export let current;
let filter = "";
let view = null;

function closePopup() {
  state.popup.set({ ...current, id: null });
}

console.log(current.room);
</script>
<Popup>
  <h2 slot="header">{current.room.name} <div class="close icon" on:click={closePopup}>close</div></h2>
  <div slot="content" class="scroll" style="max-height: min(50vh, 800px); max-width: 800px">
    {#if view === "state"}
      <Search width={500} bind:value={filter} />
      {#each current.room.state.filter(i => i.type !== "m.room.member").filter(i => JSON.stringify(i).includes(filter)) as event}
        <pre><code>{@html highlight(JSON.stringify(event, null, 4), Prism.languages.js, "json")}</code></pre>
      {/each}
    {:else if view === "members"}
      <Search width={500} bind:value={filter} />
      {#each current.room.state.filter(i => i.type === "m.room.member").filter(i => JSON.stringify(i).includes(filter)) as event}
        <pre><code>{@html highlight(JSON.stringify(event, null, 4), Prism.languages.js, "json")}</code></pre>
      {/each}
    {:else}
      <div>room id: <code style="user-select: all">{current.room.roomId}</code></div><br />
      <Button label="Room State" clicked={() => view = "state"}/>
      <Button label="Room Members" clicked={() => view = "members"}/>
    {/if}
  </div>
  <div slot="footer">
    {#if view}
    <Button label="back" clicked={() => view = null}/>
    {/if}
  </div>
</Popup>
