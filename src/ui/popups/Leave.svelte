<script>
import Button from "../atoms/Button.svelte";
import Popup from "../atoms/Popup.svelte";
export const confirm = leave;
export let current;

function capitalize(str) {
  if (!str?.length) return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

async function leave() {
  const roomId = current.room.id;
  state.log.debug("goodbye " + roomId);
  state.api.leaveRoom(roomId);
  state.popup.set({ ...current, id: null });
  actions.to("/chat");
}
</script>
<Popup>
  <h2 slot="header">Leave {current.room.name}</h2>
  <p slot="content" style="max-width: 440px">
    Are you sure you want to leave <b>{current.room.name}</b>?
    {#if current.room.joinRule !== "public"}
    You won't be able to rejoin this {current.type} unless you're re-invited.
    {:else}
    This {current.type} is public and can be rejoined at any time. (Unless it's made private!)
    {/if}
  </p>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Leave {capitalize(current.type)}" clicked={leave} />
  </div>
</Popup>
