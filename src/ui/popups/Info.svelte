<script>
import Popup from "../atoms/Popup.svelte";
export let current;
</script>
<Popup showClose>
  <h2 slot="header">{current.head}</h2>
  <div slot="content" style:width="440px">
    {#if current.html}
    {@html current.body}
    {:else}
    {current.body}
    {/if}
  </div>
</Popup>
