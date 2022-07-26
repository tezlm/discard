<script>
import Popup from "../atoms/Popup.svelte";
export let current;

function closePopup() {
  state.popup.set({ ...current, id: null });
}
</script>
<Popup>
  <h2 slot="header">{current.head} <div class="close icon" on:click={closePopup}>close</div></h2>
  <div slot="content" style:width="440px">
    {#if current.html}
    {@html current.body}
    {:else}
    {current.body}
    {/if}
  </div>
</Popup>
