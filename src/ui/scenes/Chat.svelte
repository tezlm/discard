<script>
import Room from '../room/Room.svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import SpaceHeader from '../space/SpaceHeader.svelte';
import UserMenu from '../user/UserMenu.svelte';
</script>
<style>
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: scroll;
}

.content-with-banner {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.banner {
  background: var(--color-accent);
  border-top-left-radius: 8px;
  padding: 8px;
  text-align: center;
  font-weight: 500;
}

.nav {
  display: flex;
  flex-direction: column;
	width: 240px;
  background: var(--bg-rooms-members);
}
</style>
<div class="wrapper">
  <SpaceNav />
  <div class="content-with-banner">
    <div hidden class="banner">Something important here</div>
    <div class="content">
      <div class="nav">
        <SpaceHeader />
        <RoomNav />
        <UserMenu />
      </div>
      <Room />
    </div>
  </div>
</div>
