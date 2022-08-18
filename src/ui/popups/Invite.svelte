<script>
import UserId from "../atoms/UserId.svelte";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
export let current;

function closePopup() {
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.split {
  box-shadow: var(--shadow-header);
  margin: 0 -16px;
  height: 3px;
}
</style>
<Popup>
  <h3 slot="header">Invite friends to {current.room.name} <div class="close icon" on:click={closePopup}>close</div></h3>
  <div slot="content">
    <b>ideas</b>
    <p>search box</p>
    <Input placeholder="Search for friends" small />
    <br />
    <br />
    <p>userid entry (discord doesnt have this though)</p>
    <UserId />
    <br />
    {#if current.room.getState("m.room.canonical_alias")?.content.alias && current.room.joinRule === "public"}
      <div class="title">Or, send a link</div>
      <Input value={"https://matrix.to/#/" + encodeURIComponent(current.room.getState("m.room.canonical_alias")?.content.alias ?? current.room.roomId)} autofocus />
    {/if}
  </div>
</Popup>

