<script>
import { highlight } from "prismjs";
export let room;
</script>
<p>pretty much exactly the same ui as discord</p>
<br />
{#each $room.state.filter(i => i.type === "im.ponies.room_emotes") as ev}
  {#if ev.content.pack}
    <br />
    <h3>{ev.content.pack.display_name}</h3>
    <p>{ev.content.pack.attribution}</p>
    <pre><code>{@html highlight(JSON.stringify(ev.content, null, 4), Prism.languages.js, "json")}</code></pre>
  {/if}
{/each}
<br />
<br />
