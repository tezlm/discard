<script>
import Button from "../atoms/Button.svelte";
import Popup from "../atoms/Popup.svelte";
// export const confirm = leave;
export let current;
let checked = {};

$: console.log(checked)

async function add() {
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.rooms {
  max-width: 440px;
  max-height: 400px;
  user-select: none;
}

.room {
  display: block;
  cursor: pointer;
  padding: 4px;
  margin-bottom: 1px;
  border-radius: 3px;
}

.room:hover {
  background: var(--mod-lighten);
}

.room.checked {
  background: var(--mod-lightener);
}

.room input {
  display: none;
}
</style>
<Popup>
  <h2 slot="header">Add Existing Room (TODO)</h2>
  <div slot="content" class="rooms scroll">
    {#each [...state.rooms.values()] as room}
      {#if !state.spaces.get(current.parent.roomId).includes(room)}
        <label class="room" class:checked={checked[room.roomId]}>
          <b>#</b> {room.name}
          <input type="checkbox" bind:checked={checked[room.roomId]} />
        </label>
      {/if}
    {/each}
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="primary" label="Add" disabled={!Object.values(checked).some((i) => i)} clicked={add} />
  </div>
</Popup>
