<script>
import RoomContent from './RoomContent.svelte';
import RoomFooter from './RoomFooter.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomHome from './RoomHome.svelte';
let room = state.focusedRoom;
</script>
<style>
.room {
	flex: 1;
	display: flex;
	flex-direction: column;
  width: 100%;
  background: var(--bg-content);
	overflow: hidden;
}
</style>

<div class="room">
  {#if $room}
  <RoomHeader />
  <RoomContent />
  <RoomFooter />
  {:else}
  <RoomHeader />
  <RoomHome />
  {/if}
</div>
