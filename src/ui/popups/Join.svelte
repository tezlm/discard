<script lang="ts">
import Popup from "../atoms/Popup.svelte";
import IdInput from "../atoms/IdInput.svelte";
import Button from "../atoms/Button.svelte";
export let current;
let localpart = "";
let homeserver = "";
let loading = false;

async function join() {
  loading = true;
  const res = await state.api.joinAlias(`#${localpart}:${homeserver}`);
  loading = false;
  if (res.error) {
    state.popup.set({ id: "dialog", title: "error", body: res.errcode });
  } else {
    state.popup.set({ ...current, id: null });
  }
}
</script>
<Popup showClose>
  <h2 slot="header">Join</h2>
  <div slot="content">
    <span class="title">Room/Space alias</span>
    <div style="height: 12px"></div>
    <IdInput kind="alias" bind:localpart={localpart} bind:homeserver={homeserver} autofocus />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" on:click={() => state.popup.set({ ...current, id: null })} />
    <Button
      type="primary"
      disabled={!(localpart && homeserver)}
      label="Join"
      {loading}
      on:click={join}
    />
  </div>
</Popup>

