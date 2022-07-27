<script>
import { parseMxc, defaultAvatar } from "../../util/content.js";
export let user;

let missingAvs = state.missingAvatars;
function getAvatar(size) {
  if (missingAvs.has(user.userId)) return;
  if (!user.avatar) {
    missingAvs.has(user.userId);
    return defaultAvatar;
  };
  return parseMxc(user.avatar, size);
}
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

.top img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
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
    <a href={getAvatar()}>
      <img
        class="avatar"
        alt="pfp for {user.name}"
        src={getAvatar(80)}
        on:error={(e) => { missingAvs.add(user.userId); e.target.src = defaultAvatar }}
      />
    </a>
    <div class="icon">more_vert</div>
  </div>
  <h3>{user.name}</h3>
  <div class="id">{user.userId}</div>
</div>
