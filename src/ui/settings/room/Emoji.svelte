<script>
import { highlight } from "prismjs";
export let room;
</script>
<p>pretty much exactly the same ui as discord</p>
<br />
<div>
{#each $room.getAllState("im.ponies.room_emotes") as ev}
  {#if ev.content.pack}
    <br />
    <h3>{ev.content.pack.display_name ?? ev.stateKey}</h3>
    {#if ev.content.pack.attribution}
    <p>{ev.content.pack.attribution}</p>
    {/if}
    <pre><code>{@html highlight(JSON.stringify(ev.content, null, 4), Prism.languages.js, "json")}</code></pre>
  {/if}
{/each}
</div>
<br />
<br />
