<script>
import Input from "../atoms/Input.svelte";
import Search from "../atoms/Search.svelte";
import Popup from "../atoms/Popup.svelte";
import Avatar from "../atoms/Avatar.svelte";
import Button from "../atoms/Button.svelte";
export let current;
let usersPromise = Promise.resolve(null);
let inviteStates = new Map();
function getLink() {
  if (current.room.joinRule !== "public") return null;
  const alias = current.room.getState("m.room.canonical_alias")?.content.alias;
  if (alias) {
    return `https://matrix.to/#/${encodeURIComponent(alias)}`;
  } else {
    const servers = current.room.members
      .with("join")
      .slice(0, 100)
      .map(i => i.id.slice(i.id.indexOf(":") + 1));
    return `https://matrix.to/#/${encodeURIComponent(current.room.id)}?via=${[...new Set(servers)].slice(0, 5).join(",")}`;
  }
}

const { users } = state;
async function fetchUser(userId) {
  if (users.has(userId)) return users.get(userId);
	const { avatar_url, displayname } = await state.api.fetchUser(userId).catch(() => ({}));
	const data = { avatar: avatar_url, name: displayname, id: userId };
	users.set(userId, data);
	return data;
}

async function searchUsers(term) {
  const { results } = await state.api.searchUsers(term);
  const users = results.map(i => ({ avatar: i.avatar_url, name: i.display_name, id: i.user_id }));
  if (/@.*:.+/.test(term)) await fetchUser(term).then(user => users.push(user)).catch(() => {});
  for (let user of users) {
    if (!state.users.has(user.id)) state.users.set(user.id, user);
    if (current.room.members.has(user.id)) inviteStates.set(user.id, getState(current.room.members.get(user.id)));
  }
  return users;
  
  function getState(member) {
    switch(member.membership) {
      case "join": return "joined";
      case "ban": return "banned";
      case "invite": return "invited";
      default: return null;
    }
  }
}

async function invite(userId) {
  inviteStates.set(userId, "inviting");
  inviteStates = inviteStates;
  try {
    await state.api.inviteMember(current.room.id, userId);
    inviteStates.set(userId, "invited");
    inviteStates = inviteStates;
  } catch (err) {
    inviteStates.delete(userId);
    inviteStates = inviteStates;
    console.error(err)
  }
}
</script>
<style>
.content {
  width: 420px;
  min-height: 200px;
  border-radius: 5px;
  background: var(--bg-content);
}

.split-top {
  box-shadow: var(--shadow-header);
  padding: 4px 16px 16px;
}

.split-top h3 {
  margin: 8px 0 16px;  
}

.userlist {
  min-height: 100px;
  max-height: min(300px, 80vh);
  padding: 0 16px;
}

.userlist .user {
  display: flex;
  padding: 8px 0;
}

.split-btm {
  border-top: solid var(--bg-rooms-members) 1px;
  padding: 16px;
}

h2.title {
  padding: 100px 0;
  text-align: center;
  font-size: 18px;
}
</style>
<Popup raw>
  <div slot="content" class="content">
    <div class="split-top">
      <h3>Invite friends to {current.room.name}</h3>
      <Search placeholder="Search for people" size="tall" escaped={() => state.popup.set({ ...current, id: null })} submitted={(term) => usersPromise = term ? searchUsers(term) : null} autofocus />
    </div>
    <div class="userlist scroll">
    {#await usersPromise}
      <h2 class="title">Searching...</h2>
    {:then users}
      {#if users}
        {#each users as user}
        <div class="user" style="align-items: center">
          <Avatar {user} size={32} />
          <div style="margin-left: 8px;flex:1;overflow:hidden">
            <div style="overflow:hidden;text-overflow:ellipsis">{user.name || user.id}</div>
            <div style="color: var(--fg-dim); font-size: 14px;overflow:hidden;text-overflow:ellipsis">{user.id}</div>
          </div>
          <div style="margin-left: 8px">
            <Button
              type="good small hollow"
              label={({ inviting: "Inviting", invited: "Invited", joined: "Joined", banned: "Banned" })[inviteStates.get(user.id)] ?? "Invite"}
              disabled={inviteStates.get(user.id)}
              loading={inviteStates.get(user.id) === "inviting"}
              clicked={() => invite(user.id)}
            />
          </div>
        </div>
        {:else}
        <h2 class="title">No results :(</h2>
        {/each}
      {:else}
        <h2 class="title">search for users</h2>
      {/if}
    {/await}
    </div>
    {#if getLink()}
    <div class="split-btm">
      <div class="title">Or, send a link</div>
      <!-- <div on:click={() => navigator.clipboard.writeText(getLink()).then(() => alert("copied!"))}> -->
        <Input value={getLink()} autoselect />
      <!-- </div> -->
    </div>
    {/if}
  </div>
</Popup>
