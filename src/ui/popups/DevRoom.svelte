<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import Search from "../atoms/Search.svelte";
import hljs from "highlight.js";
export let current;
let filter = "";
let view = null;

console.log(current.room);
</script>
<Popup showClose>
  <h2 slot="header">{current.room.name}</h2>
  <div slot="content" class="scroll" style="max-height: min(50vh, 800px); max-width: 800px">
    {#if view === "state"}
      <Search width={500} bind:value={filter} />
      {#each current.room.state.filter(i => i.type !== "m.room.member").filter(i => JSON.stringify(i.raw).includes(filter)) as event}
        <pre><code>{@html hljs.highlight("json", JSON.stringify(event.raw, null, 4)).value}</code></pre>
      {/each}
    {:else if view === "members"}
      <Search width={500} bind:value={filter} />
      {#each current.room.getAllState("m.room.member").filter(i => JSON.stringify(i.raw).includes(filter)) as event}
        <pre><code>{@html hljs.highlight("json", JSON.stringify(event.raw, null, 4)).value}</code></pre>
      {/each}
    {:else if view === "account"}
      <Search width={500} bind:value={filter} />
      {#each [...current.room.accountData.entries()].filter(i => i[0].includes(filter)) as data}
        <div class="title" style="margin-top: 1em">{data[0]}</div>
        <pre><code>{@html hljs.highlight("json", JSON.stringify(data[1], null, 4)).value}</code></pre>
      {/each}
    {:else}
      <div>room id: <code style="user-select: all">{current.room.id}</code></div><br />
      <Button label="Room State" on:click={() => view = "state"}/>
      <Button label="Room Members" on:click={() => view = "members"}/>
      <Button label="Account Data" on:click={() => view = "account"}/>
    {/if}
  </div>
  <div slot="footer">
    {#if view}
    <Button label="back" on:click={() => view = null}/>
    {/if}
  </div>
</Popup>
