<script>
import Button from "../../atoms/Button.svelte";
</script>
<div style="margin: 2em auto;">
  <div style="border-radius: 4px; background: var(--bg-rooms-members); border: solid var(--bg-spaces) 1px; padding: 16px; display: inline-block; user-select: text">
    <b>welcome to discard!</b>
    <p>i consider this software to be pre-alpha, so expect bugs and missing features!</p>
  </div>
  <br />
  <br />
  <div>
    <Button type="normal" label="Create Space" clicked={() => state.popup.set({ id: "create", type: "space" })} />
    <Button type="primary" label="Create Room" clicked={() => state.popup.set({ id: "create", type: "room" })} />
  </div>
</div>
