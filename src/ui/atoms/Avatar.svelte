<svelte:options immutable />
<script>
// TODO: properly handle per-room avatars
import { parseMxc, generateAvatar } from "../../util/content.js";
export let user;
export let size;
export let link = false;
let missing = state.missingAvatars;

function getAvatar(crop = true) {
  if (!user.avatar) return generateAvatar(user.userId);
  return missing.has(user.userId) ? generateAvatar(user.userId) : parseMxc(user.avatar, crop ? size : null);
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
<svelte:element this={link ? "a" : "div"} href={link ? getAvatar(false) : null}>
  <img
    class="avatar"
    alt={"avatar for " + user.name ?? user.userId}
    loading="lazy"
    style:height={size + "px"}
    style:width={size + "px"}
    src={getAvatar()}
    on:error={handleError}
  />
</svelte:element>
