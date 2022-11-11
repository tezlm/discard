<script>
import Avatar from "./Avatar.svelte";
export let user;
export let size;
export let newData;
export let changed = null;

$: reset(user);

export function reset() {
  newData = {
    avatar: user.avatar,
    id: user.id,
    name: user.name,
    file: null,
  };
}

function handleAvatarClick(e) {
  if (newData.avatar) {
    e.preventDefault();
    newData.avatar = null;
    changed?.(newData);
  }
}

function handleAvatarChange(e) {
  newData.file = e.target.files[0];
  newData.avatar = URL.createObjectURL(newData.file);
  changed?.(newData);
}
</script>
<style>
.uploader {
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-high);
  border-radius: 50%;
  overflow: hidden;
}

.button {
  text-align: center;
  margin-top: 4px;
  color: var(--fg-muted);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.button:hover {
  color: var(--fg-light);
}

.uploader > .icon {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #22222288;
  font-weight: 500;
  font-size: 24px;
  opacity: 0;
  cursor: pointer;
  transition: opacity .2s;
}

.uploader:hover > .icon {
  opacity: 1;
}
</style>
<label style="display: block">
  <div class="uploader">
    <Avatar user={newData} {size} />
    <div class="icon">edit</div>
  </div>
  <div class="button" on:click={handleAvatarClick}>{#if newData.avatar}Remove{:else}Upload{/if}</div>
  <input type="file" accept="image/*" style="display: none" on:change={handleAvatarChange} />
</label>
