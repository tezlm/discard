<script>
import { parseMxc, generateAvatar } from "../../util/content";
export let user;
export let size;
export let link = false;
export let square = false;
let missing = state.missingAvatars;

// TODO: handle per room avatars
// TODO: redo this code, right now it assumes things are a user (workaround for rooms)

function getAvatar(user, crop = true) {
  const id = user?.id;
  if (!user?.avatar) return generateAvatar(id);
  return missing.has(id) ? generateAvatar(id) : parseMxc(user.avatar, crop ? size : null);
}

function handleError(e) {
  missing.add(user.id);
  e.target.src = getAvatar();
}
</script>
<style>
.avatar {
  background-color: var(--bg-spaces);
  object-fit: cover;
  user-select: none;
}
</style>
<svelte:element
  this={link ? "a" : "div"}
  href={link ? getAvatar(user, false) : null}
  style:height={size + "px"}
  style:width={size + "px"}
>
  <img
    class="avatar"
    alt={"avatar for " + user.name || user.id}
    loading="lazy"
    style:border-radius={!square && size / 2 + "px"}
    style:height={size + "px"}
    style:width={size + "px"}
    src={getAvatar(user)}
    on:error={handleError}
  />
</svelte:element>
