<script>
import { parseMxc, defaultAvatar } from "../../util/content.js";
export let mxc;
export let size;
let missing = state.missingAvatars;

function getAvatar(mxc, size) {
  if (!mxc) return defaultAvatar;
  return missing.has(mxc) ? defaultAvatar : parseMxc(mxc, size);
}

function handleError() {
  missing.add(mxc);
  this.src = defaultAvatar;
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
  loading="lazy"
  style:height={size + "px"}
  style:width={size + "px"}
  src={getAvatar(mxc, size)}
  on:error={handleError}
/>
