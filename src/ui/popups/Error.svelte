<script>
import Popup from "../atoms/Popup.svelte";
export let current;

// TODO: show this popup with helpful details on error
</script>
<Popup showClose>
  <h2 slot="header">oh no</h2>
  <p slot="content">it broke</p>
</Popup>
