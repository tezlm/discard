<script>
import RoomContent from './RoomContent.svelte';
import RoomInput from './RoomInput.svelte';
import RoomHeader from './RoomHeader.svelte';
let room = state.focusedRoom;
</script>
<style>
.room {
  background: var(--bg-content);
	flex: 1;
	display: flex;
	flex-direction: column;
  padding-bottom: 1em;
}
</style>

<div class="room">
  {#if $room}
  <RoomHeader />
  <RoomContent />
  <RoomInput placeholder={"Message " + ($room ?? {}).name} />
  {:else}
  <div style="padding: 4em">
    <p>discord would put a friends list here, but i don't know the equivilant of that in matrix<p><br>
    <p>ideas for what could be here</p><br>
    <ul>
      <li>room invites</li>
      <li>recent rooms</li>
      <li>pings/mentions/notifications</li>
      <li>create space/room (eeh, discord already has a button for that)</li>
      <li>...etc?</li>
    </ul><br>
    <p>Sidebars will have dms and group chats of course, but since a lot of matrix is uncategorized group chats that might be too messy</p>
  </div>
  {/if}
</div>
