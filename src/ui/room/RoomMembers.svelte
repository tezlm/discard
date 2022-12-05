<script>
import Avatar from "../atoms/Avatar.svelte";
import VirtualList from "svelte-virtual-scroll-list"
import { memberContext } from "../../util/context";
import { fastclick } from "../../util/use";
export let room;

let { popout, context } = state;
let members = [];

$: if (room) {
  members = generatePlaceholders(room);
  fetchList(room).then(list => members = list);
}

async function fetchList(room) {
  if (!room.request) await room.members.fetchAll("join");
  return parseList(room, room.members.with("join"));
}

function generatePlaceholders(room) {
  const { levels } = room.power;
  const withPl = Object.values(levels.users).map(power => ({ power }));
  const len = Math.max((room.summary.joined ?? 0) - withPl.length, 0);
  const normal = new Array(len).fill(null).map(() => ({ power: levels.usersDefault }));
  const parsed = parseList(room, withPl.concat(normal).sort((a, b) => b - a));
  return parsed.map((obj, id) => (obj.title ? obj : { power: obj.power, id }));
}

function parseList(room, members) {
  if (state.dms.has(room.id)) {
    return [{ title: `members: ${members.length}`, id: "members" }, ...members];
  }
  const sections = { goku: [], admins: [], moderators: [], notable: [], members: [], gone: [] };
  for (let member of members) {
    if (member.power > 9000) {
      sections.goku.push(member);
    } else if (member.power >= 100) {
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
  oldId = room.id;
}

function handleClick(e) {
  const target = e.explicitOriginalTarget;
  const memberId = target?.dataset?.memberId;
  if (!memberId) return;
  const rect = target.getBoundingClientRect();
  const _owner = `memberlist-${memberId}`;
  if ($popout._owner === _owner) return $popout = {};
  e.stopPropagation();
  $popout = {
    id: "member",
    member: room.members.get(memberId),
    animate: "left",
    top: rect.y,
    right: window.innerWidth - rect.x + 8,
    _owner,
  };
}

function handleContext(e) {
  const memberId = e.explicitOriginalTarget?.dataset.memberId;
  if (!memberId) return;
  $context = {
    items: memberContext(room.members.get(memberId)),
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
  user-select: none;
}

.title {
  margin: 16px 16px 0;
  color: var(--fg-dim);
}

.wrapper {
  padding: 1px 8px;
  cursor: pointer;
}

.wrapper.last {
  margin-bottom: 8px;
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
  color: var(--fg-content);
  background: var(--mod-lighten);
}

.wrapper:active > .member, .wrapper.selected > .member {
  color: var(--fg-notice);
  background: var(--mod-lightener);
}

.member {
  color: var(--fg-dim);  
  font-weight: 500;
}

.member .name {
  margin: 0 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.wrapper.placeholder {
  cursor: initial;
  background: transparent;
}

.placeholder .avatar {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.placeholder .name {
  height: 16px;
  width: 120px;
  border-radius: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%   { background: var(--bg-misc) }
  50%  { background: var(--bg-spaces) }
  100% { background: var(--bg-misc) }
}
</style>
<div
  class="members scroll"
  tabindex="-1"
  use:fastclick
  on:fastclick={handleClick}
  on:contextmenu|preventDefault|stopPropagation={handleContext}
  on:click={e => e.explicitOriginalTarget?.dataset.memberId && e.stopPropagation()}
>
  <VirtualList
      data={members}
      let:data={member}
      estimateSize={48}
  >
    {#if member.title}
      <div class="title">{member.title}</div>
    {:else if member.room}
      <div
        class="wrapper"
        class:selected={$popout._owner === "memberlist-" + member.id}
        class:last={members.at(-1) === member}
        data-member-id={member.id}
      >
        <div class="member">
          <Avatar user={member} size={32} />
          <div class="name">{member.name || member.id}</div>
        </div>
      </div>
    {:else}
      <div class="wrapper placeholder">
        <div class="member">
          <div class="avatar" style:animation-delay="{member.id * -50}ms"></div>
          <div class="name" style:animation-delay="{member.id * -50}ms"></div>
        </div>
      </div>
    {/if}
  </VirtualList>
</div>
