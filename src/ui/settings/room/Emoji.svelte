<script>
import hljs from "highlight.js";
export let room;
</script>
<p>pretty much exactly the same ui as discord</p>
<br />
<div>
{#each room.getAllState("im.ponies.room_emotes") as ev}
  {#if ev.content.pack}
    <br />
    <h3>{ev.content.pack.display_name ?? ev.stateKey}</h3>
    {#if ev.content.pack.attribution}
    <p>{ev.content.pack.attribution}</p>
    {/if}
    <pre><code>{@html hljs.highlight("json", JSON.stringify(ev.content, null, 4)).value}</code></pre>
  {/if}
{/each}
</div>
<br />
<br />
