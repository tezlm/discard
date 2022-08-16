<script>
import { parseMxc, generateAvatar } from "../../util/content.js";
export let user;
export let size;
let missing = state.missingAvatars;

function getAvatar() {
  if (!user.avatar) return generateAvatar(user.userId);
  return missing.has(user.userId) ? generateAvatar(user.userId) : parseMxc(mxc, size);
}

function handleError(e) {
  missing.add(user.userId);
  e.target.src = getAvatar();
}
</script>
<style>
.avatar {
  border-radius: 50%;
  background-color: var(--bg-spaces);
  object-fit: cover;
  user-select: none;
}
</style>
<img
  class="avatar"
  alt="shutup a11y"
  loading="lazy"
  style:height={size + "px"}
  style:width={size + "px"}
  src={getAvatar()}
  on:error={handleError}
/>
