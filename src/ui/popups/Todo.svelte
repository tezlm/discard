<script>
import Popup from "../atoms/Popup.svelte";
export let current;
</script>
<Popup showClose>
  <h2 slot="header">todo</h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
