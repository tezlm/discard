<script>
// TODO: automatically load/unload members on scroll
import Button from "../atoms/Button.svelte";
import Avatar from "../atoms/Avatar.svelte";
import { memberContext } from "../../util/context";
import { fastclick } from "../../util/use";
export let room;
let count = 30;

let { popout, context } = state;

async function fetchList(room) {
  if (!room.request) await room.members.fetch();
  const members = room.members.with("join");
  if (state.dms.has(room.id)) {
    return [{ title: `members: ${members.length}`, id: "members" }, ...members];
  }
  const sections = { admins: [], moderators: [], notable: [], members: [], gone: [] };
  for (let member of members) {
    if (member.power >= 100) {
      sections.admins.push(member);
    } else if (member.power >= 50) {
      sections.moderators.push(member);
    } else if (member.power > room.power.usersDefault) {
      sections.notable.push(member);
    } else if (member.power < room.power.usersDefault) {
      sections.gone.push(member);
    } else {
      sections.members.push(member);
    } 
  }
  const rendered = [];
  for (let section in sections) {
    if (sections[section].length) {
      rendered.push({ title: `${section}- ${sections[section].length}`, id: section }, ...sections[section]);
    }
  }
  return rendered;
}

let oldId = null;
$: if (room.id !== oldId) {
  count = 20;
  oldId = room.id;
	console.time("room members")
	queueMicrotask(() => console.timeEnd("room members"));
}

function showMemberPopout(e, member) {
  const rect = e.target.getBoundingClientRect();
  if ($popout._owner === e.target) return $popout = {};
  $popout = {
    id: "member",
    member,
    animate: "left",
    top: rect.y,
    right: window.innerWidth - rect.x + 8,
    _owner: e.target,
  };
}

function showContext(e, member) {
  $context = {
    items: memberContext(member),
    x: e.clientX,
    y: e.clientY,
  };
}

// TODO: resize room members when search box closed
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
  pointer-events: none;
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
    {#each Array(count) as _}
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
        <!-- TODO: optimize by putting single click/context listener on wrapper instead of each element -->
        <div
          class="wrapper"
          use:fastclick
          on:fastclick={(e) => showMemberPopout(e, member)}
          on:contextmenu|preventDefault|stopPropagation={(e) => showContext(e, member)}
        >
          <div class="member">
            <Avatar user={member} size={32} />
            <div class="name">{member.name || member.id}</div>
          </div>
        </div>
      {/if}
    {/each}
    {#if count < items.length}
    <Button label="more" type="link big" clicked={() => count += 20} />
    {/if}
  {/await}
</div>
