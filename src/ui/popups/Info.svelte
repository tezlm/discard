<script>
import Popup from "../atoms/Popup.svelte";
export let current;
</script>
<style>
.content {
  max-width: max(640px, 30vw);
  white-space: pre-wrap;
}
</style>
<Popup showClose>
  <h2 slot="header">{current.head}</h2>
  <div slot="content" class="content">
    {#if current.html}
    {@html current.body}
    {:else}
    {current.body}
    {/if}
  </div>
</Popup>
