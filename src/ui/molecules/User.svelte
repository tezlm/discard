<script>
import Avatar from "../atoms/Avatar.svelte";
export let user;
</script>
<style>
.popout {
  min-width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.popout .top {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.top .icon {
  font-size: 22px;
  cursor: pointer;
}

.top .icon:hover {
  color: var(--fg-notice);
}

.popout h3 {
  margin-top: 8px;
  font-weight: 500;
  font-family: var(--font-display);
  color: var(--fg-notice);
}

.popout .id {
  color: var(--fg-muted);
  font-size: 14px;
  user-select: all;
}
</style>
<div class="popout">
  <div class="top">
    <Avatar {user} size={80} />
    <div class="icon">more_vert</div>
  </div>
  <h3>{user.name}</h3>
  <div class="id">{user.userId}</div>
</div>
