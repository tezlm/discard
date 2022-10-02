<script>
// seems to re-render on *every* message, due to the way `room` is updated?
// TODO: automatically load/unload members on scroll
import Button from "../atoms/Button.svelte";
import Avatar from "../atoms/Avatar.svelte";
export let room;
let count = 20;

async function fetchList(room) {
  if (!room.request) await room.members.fetch();
  const members = room.members.with("join");
  return [{ title: `members - ${members.length}`}, ...members];
}

let oldId = null;
$: if (room.roomId !== oldId) {
  console.log(room);
  count = 20;
  oldId = room.roomId;
}
</script>
<style>
.members {
  background: var(--bg-rooms-members);
  height: 100%;
  width: 240px;
}

.title {
  margin: 16px 16px 0;
  color: var(--fg-dim);
}

.wrapper {
  padding: 1px 8px;
  cursor: pointer;
}

.member {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 4px 8px;
  border-radius: 4px;
}

.wrapper:hover > .member {
  background: rgba(79, 84, 92, 0.4);
}

.member .name {
  margin: 0 16px;
  color: var(--fg-dim);
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<div class="members scroll" tabindex="-1">
  {#await fetchList(room) then items}
    {#each items.slice(0, count) as member (member.userId)}
      {#if member.title}
        <div class="title">{member.title}</div>
      {:else}
        <!-- TODO: open members popout instead of user popup -->
        <div class="wrapper" on:click={() => state.popup.set({ id: "user", userId: member.userId })}>
          <div class="member">
            <Avatar user={member} size={32} />
            <div class="name">{member.name || member.userId}</div>
          </div>
        </div>
      {/if}
    {/each}
    {#if count < items.length}
    <Button label="more" type="link big" clicked={() => count += 20} />
    {/if}
  {/await}
</div>
