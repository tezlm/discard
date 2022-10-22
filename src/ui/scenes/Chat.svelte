<script>
import Room from '../room/Room.svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import SpaceHeader from '../space/SpaceHeader.svelte';
import UserMenu from '../user/UserMenu.svelte';
</script>
<style>
.nav {
  display: flex;
  flex-direction: column;
	width: 240px;
  background: var(--bg-rooms-members);
}
</style>
<div style="display: flex; flex-direction: column;">
  <div style="display: flex; flex-direction: row; flex: 1; height: 0">
    <SpaceNav />
    <div class="nav">
      <SpaceHeader />
      <RoomNav />
      <UserMenu />
    </div>
  </div>
</div>
<Room />
