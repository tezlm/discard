<script>
// seems to re-render on *every* message, due to the way `room` is updated?
// TODO: automatically load/unload members on scroll
import Button from "../atoms/Button.svelte";
import Avatar from "../atoms/Avatar.svelte";
export let room;
let count = 20;

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchList(room) {
  if (!room.request) await room.members.fetch();
  const members = room.members.with("join");
  if (state.dms.has(room.id)) {
    return [{ title: `members: ${members.length}`, id: "members" }, ...members];
  }
  const sections = { admins: [], moderators: [], members: [] };
  for (let member of members) {
    if (member.power >= 100) {
      sections.admins.push(member);
    } else if (member.power >= 50) {
      sections.moderators.push(member);
    } else {
      sections.members.push(member);
    } 
  }
  const rendered = [];
  if (sections.admins.length) {
    rendered.push({ title: `admins - ${sections.admins.length}`, id: "admins" }, ...sections.admins);
  }
  if (sections.moderators.length) {
    rendered.push({ title: `moderators - ${sections.moderators.length}`, id: "moderators" }, ...sections.moderators);
  }
  if (sections.members.length) {
    rendered.push({ title: `members - ${sections.members.length}`, id: "members" }, ...sections.members);
  }
  return rendered;
}

let oldId = null;
$: if (room.roomId !== oldId) {
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
  {#await fetchList(room)}
    <div class="title">Loading...</div>
    {#each Array(20) as _}
    <!-- TODO: cleanup -->
    <div class="wrapper" style="cursor: initial; background: transparent !important">
      <div class="member">
        <div style="height:32px;width:32px;border-radius:50%;background:var(--bg-spaces)"></div>
        <div style="height:16px;width:120px;border-radius:8px;background:var(--bg-misc); margin-left: 16px"></div>
      </div>
    </div>
    {/each}
  {:then items}
    {#each items.slice(0, count) as member (member.id)}
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
