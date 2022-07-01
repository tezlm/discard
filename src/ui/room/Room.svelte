<script>
import RoomContent from './RoomContent.svelte';
import RoomInput from './RoomInput.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomHome from './RoomHome.svelte';
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
  <RoomHeader />
  <RoomHome />
  {/if}
</div>
