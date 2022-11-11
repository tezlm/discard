<script>
import Button from "../atoms/Button.svelte";
import Avatar from "../atoms/Avatar.svelte";
import VirtualList from "svelte-virtual-scroll-list"
import { memberContext } from "../../util/context";
import { fastclick } from "../../util/use";
export let room;
let count = 30;

let { popout, context } = state;

async function fetchList(room) {
  if (!room.request) await room.members.fetchAll("join");
  const members = room.members.with("join");
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
  count = 20;
  oldId = room.id;
}

function handleClick(e) {
  const target = e.explicitOriginalTarget;
  const memberId = target?.dataset.memberId;
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
  background: var(--mod-lighten);
}

.wrapper:active > .member, .wrapper.selected > .member {
  background: var(--mod-lightener);
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
<div
  class="members scroll"
  tabindex="-1"
  use:fastclick
  on:fastclick={handleClick}
  on:contextmenu|preventDefault|stopPropagation={handleContext}
  on:click={e => e.explicitOriginalTarget?.dataset.memberId && e.stopPropagation()}
>
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
    <VirtualList
        data={items}
        let:data={member}
        estimateSize={48}
    >
      {#if member.title}
        <div class="title">{member.title}</div>
      {:else}
        <div
          class="wrapper"
          class:selected={$popout._owner === "memberlist-" + member.id}
          class:last={items.at(-1) === member}
          data-member-id={member.id}
        >
          <div class="member">
            <Avatar user={member} size={32} />
            <div class="name">{member.name || member.id}</div>
          </div>
        </div>
      {/if}
    </VirtualList>
  {/await}
</div>
