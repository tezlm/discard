<script>
import Input from "../../atoms/Input.svelte";
import Textarea from "../../atoms/Textarea.svelte";
import Avatar from "../../atoms/Avatar.svelte";
export let room;
export let save = null;
let name, topic, avatar, aliases = [];

export function reset() {
  name = room?.name ?? "";
  topic = room?.topic ?? "";
  avatar = { avatar: room?.avatar, id: room.id };
}

$: {
  const canonAlias = room.getState("m.room.canonical_alias")?.content ?? {};
  aliases = [];
  if (canonAlias.alias) aliases.push({ main: true, alias: canonAlias.alias });
  if (canonAlias.alt_aliases) aliases.push(...canonAlias.alt_aliases.map(alias => ({ main: false, alias })));
}

reset();

function handleAvatarClick(e) {
  if (avatar.avatar) {
    e.preventDefault();
    avatar.avatar = null;
  }
}

function changeAvatar(e) {
  avatar.file = e.target.files[0];
  avatar.avatar = URL.createObjectURL(avatar.file);
}

$: {
  let nameChanged = name !== (room?.name ?? "");
  let topicChanged = topic !== (room?.topic ?? "");
  let avatarChanged = avatar.avatar !== room?.avatar;
  if (nameChanged || topicChanged || avatarChanged) {
    save = async () => {
      const proms = [];
      if (nameChanged) proms.push(state.api.sendState(room.id, "m.room.name", "", { name }));
      if (topicChanged) proms.push(state.api.sendState(room.id, "m.room.topic", "", { topic }));
      if (avatarChanged) {
        if (avatar.file) {
          const prom = state.api.uploadFile(avatar.file).promise
            .then(url => state.api.sendState(room.id, "m.room.avatar", "", { url }));
          proms.push(prom);
        } else {
          proms.push(state.api.sendState(room.id, "m.room.avatar", "", { url:  null }));
        }
      }
      await Promise.all(proms);
      save = null;
    }
  } else {
    save = null;
  }
}
</script>
<style>
h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
}

.avatar {
  display: flex;
  flex-direction: column;
}

.avatar .uploader {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

.avatar .uploader {
  box-shadow: var(--shadow-high);
}

.avatar > .button {
  text-align: center;
  margin-top: 10px;
  color: var(--fg-muted);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.avatar > .button:hover {
  color: var(--fg-light);
}

.name {
  flex: 1;
  margin-left: 10px;
}

.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: solid #4F545C7b 1px;
}

.section:last-child {
  padding-bottom: none;
  margin-bottom: none;
  border-bottom: none;
}

.uploader {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.uploader > div {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  background: #22222288;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity .2s;
  font-weight: 500;
  font-size: 32px;
}

.uploader:hover > .icon {
  opacity: 1;
}
</style>
<h1>Space Overview</h1>
<div>
  <div class="section" style="flex-direction: row">
    {#if room.power.me >= room.power.forState("m.room.avatar")}
    <label class="avatar">
      <div class="uploader">
        <Avatar user={avatar} size={100} />
        <div class="icon">edit</div>
      </div>
      <div class="button" on:click={handleAvatarClick}>{#if avatar.avatar}Remove{:else}Upload{/if}</div>
      <input type="file" accept="image/*" style="display: none" on:change={changeAvatar} />
    </label>
    {:else}
    <div class="avatar">
      <div class="uploader">
        <Avatar link user={avatar} size={100} />
      </div>
    </div>
    {/if}
    <div class="name">
      <h3 class="title">Space Name</h3>
      <Input
        bind:value={name}
        placeholder="amazing-room"
        submitted={() => save && save()}
        readonly={room.power.me < room.power.forState("m.room.name")}
      />
    </div>
  </div>
  <div class="section">
    <h3 class="title">Space Topic</h3>
    <Textarea
      bind:value={topic}
      placeholder="what an amazing room"
      readonly={room.power.me < room.power.forState("m.room.topic")}
    />
  </div>
  <div class="section">
    <h3 class="title">Aliases</h3>
    <ul>
      {#each aliases as { alias, main }}
      <li><span style:user-select="all">{alias}</span> {#if main}<i>(main)</i>{/if}</li>
      {:else}
      <li><i>no aliases</i></li>
      {/each}
    </ul>
  </div>
  {#if state.settingsRef.get("shadowdev")}
  <div class="section">
    <h3 class="title">Developers</h3>
    <p><b>Room Id:</b> <code style="user-select: all">{room.id}</code></p>
    <p><b>Room Version:</b> <code style="user-select: all">{room.getState("m.room.create")?.content.room_version ?? "no m.room.create!"}</code></p>
  </div>
  {/if}
</div>
