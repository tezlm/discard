<script>
import Search from "../../atoms/Search.svelte";
import Avatar from "../../atoms/Avatar.svelte";

export let room, membership;
let users = state.users;

let allMembers = false;
let members = false;
let filter;

$: setTimeout(async () => {
  await $room.members.fetch();
  allMembers = $room.members.with(membership);
});

$: if (allMembers) {
  members = allMembers.filter(i => i.name.includes(filter) || i.userId.includes(filter));
}

function getTitle(membership) {
  switch (membership) {
    case "join": return "Member";
    case "invite": return "Invite";
    case "ban": return "Ban";
  }
}

async function getMember(member) {
  if (membership === "join") return member;
  if (users.has(member.userId)) return users.get(member.userId);
  const { displayname, avatar_url } = await state.api.fetchUser(member.userId);
  const data = { avatar: avatar_url, name: displayname || member.userId, userId: member.userId };
  users.set(member.userId, data);
  return data;
}

function getContextMenu(member) {
  const name = member.name || member.userId;
  return [
    { label: "Profile", clicked: todo, icon: "person" },
    { label: "Mention", clicked: todo, icon: "notifications" },
    { label: "Message", clicked: todo, icon: "message" },
    { label: "Block",   clicked: todo, icon: "block" },
    null,
    { label: "Remove Messages",  clicked: () => state.popup.set({ id: "deleterecent", room, member }), icon: "delete",        color: "var(--color-red)" },
    { label: `Kick ${name}`,     clicked: () => state.popup.set({ id: "kick",         room, member }), icon: "person_remove", color: "var(--color-red)" },
    { label: `Ban ${name}`,      clicked: () => state.popup.set({ id: "ban",          room, member }), icon: "person_remove", color: "var(--color-red)" },
    null,
    { label: "Power",   clicked: todo, submenu: [] },
    null,
    { label: "Copy ID", clicked: copy(member.userId), icon: "terminal" },
  ];

	function copy(text) {
		return () => navigator.clipboard.writeText(text);
	}
}
</script>
<style>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

h1 {
  font: 20px var(--font-display);
  font-weight: 500;
}

.member {
  display: flex;
  padding: 8px 0;
  border-top: solid var(--color-gray) 1px;
}

.member .name {
  display: flex;
  flex-direction: column;
  color: var(--fg-notice);
  margin-left: 16px;
}

.power, .menu {
  display: flex;
  align-items: center;
}

.menu {
  font-size: 26px;
  margin-left: 16px;
  padding: 8px;
  color: var(--fg-dim);
  opacity: 0;
  cursor: pointer;
  transition: color .2s;
}

.member:hover .menu {
  opacity: 1;
}

.menu:hover {
  color: var(--fg-notice);
}
</style>
{#if room}
  <div class="header">
    <h1>{members ? members.length || "No" : "Loading"} {filter ? "Filtered " : ""}{getTitle(membership)}{members.length !== 1 ? "s" : ""}</h1>
    <div><Search width={220} placeholder="Filter {getTitle(membership).toLowerCase()}s" bind:value={filter} /></div>
  </div>
  {#if members}
    {#each members as member}
    <div class="member" on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: getContextMenu(member), x: e.clientX, y: e.clientY })}>
      {#await getMember(member)}
        <div class="avatar"></div>
        <div class="name">
          {member.userId}
          <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
        </div>
      {:then member}
      <Avatar user={member} size={40} />
      <div class="name">
        {member.name}
        <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
      </div>
      {/await}
      <div style="margin-left: auto;"></div>
      {#if membership === "join"}
      <div class="power">{member.power}</div>
      {/if}
      <div class="icon menu" on:click|stopPropagation={e => state.context.set({ items: getContextMenu(member), x: e.clientX, y: e.clientY })}>more_vert</div>
    </div>
    {:else}
    <p>hmmm, seems like nobody's here?</p>
    {/each}
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
