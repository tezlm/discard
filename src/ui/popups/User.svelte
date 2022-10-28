<script>
import Popup from "../atoms/Popup.svelte";
import Avatar from "../atoms/Avatar.svelte";
import Loading from "../atoms/Loading.svelte";
export let current;
const users = state.users;
let profilePromise = getProfile(current.userId);

async function getProfile(userId) {
  if (users.has(userId)) return users.get(userId);
	const { avatar_url, displayname } = await state.api.fetchUser(userId).catch(() => ({}));
	const data = { avatar: avatar_url, name: displayname, id: userId };
	users.set(userId, data);
	return data;
}
</script>
<style>
.content {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 550px;
  border-radius: 5px;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  height: 100px;
  padding: 8px 12px;
  background: var(--bg-rooms-members);
}

.info {
  flex: 1;
  padding: 8px;
  background: var(--bg-content);
}
</style>
<Popup raw>
  <div slot="content" class="content">
    {#await profilePromise}
      <div class="header">
        <Loading />
        <div style="margin-left: 12px;">
          <h2>loading...</h2>
        </div>
      </div>
      <div class="info"></div>
    {:then user}
    <div class="header">
      <Avatar link size={72} {user} />
      <div style="margin-left: 12px;">
        <h2>{user.name || user.id}</h2>
        <span>{user.id}</span>
      </div>
    </div>
    <div class="info">
      more text here, foo bar baz<br />
      even more text here<br />
      this is a work in progress, what should i put here?<br />
      <ul>
        <li>send message</li>
        <li>(un)block</li>
        <li>presence?</li>
        <li>notes?</li>
        <li>about me and other profile data?</li>
      </ul>
    </div>
    {/await}
  </div>
</Popup>
