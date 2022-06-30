<script>
import RoomContent from './RoomContent.svelte';
import RoomInput from './RoomInput.svelte';
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
  <RoomContent />
  <RoomInput placeholder={"Message " + ($room ?? {}).name} />
</div>
