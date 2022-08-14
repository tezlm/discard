<script>
import Avatar from "../atoms/Avatar.svelte";
export let room;

async function fetchList(room) {
  await room.members.fetch();
  await new Promise(res => setTimeout(res, 1))
  const members = room.members.with("join");
  return [{ title: `members - ${members.length}`}, ...members];
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
}

.member {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
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
    {#each items as member}
      {#if member.title}
        <div class="title">{member.title}</div>
      {:else}
        <div class="wrapper">
          <div class="member">
            <Avatar mxc={member.avatar} size={32} />
            <div class="name">{member.name || member.userId}</div>
          </div>
        </div>
      {/if}
    {/each}
  {/await}
</div>
