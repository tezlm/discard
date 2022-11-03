<script>
import Input from "../../atoms/Input.svelte";
import Textarea from "../../atoms/Textarea.svelte";
export let room;
export let save = null;
let name, topic, aliases = [];

export function reset() {
  name = room?.name ?? "";
  topic = room?.topic ?? "";  
}

$: {
  const canonAlias = room.getState("m.room.canonical_alias")?.content ?? {};
  aliases = [];
  if (canonAlias.alias) aliases.push({ main: true, alias: canonAlias.alias });
  if (canonAlias.alt_aliases) aliases.push(...canonAlias.alt_aliases.map(alias => ({ main: false, alias })));
}

// TODO: live update

reset();

$: {
  let nameChanged = name !== (room?.name ?? "");
  let topicChanged = topic !== (room?.topic ?? "");
  if (nameChanged || topicChanged) {
    save = async () => {
      const proms = [];
      if (nameChanged) proms.push(room.sendState("m.room.name", { name }));
      if (topicChanged) proms.push(room.sendState("m.room.topic", { topic }));
      await Promise.all(proms);
      save = null;
    }
  } else {
    save = null;
  }
}
</script>
<style>
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
</style>
<div>
  <div class="section">
    <h3 class="title">Room Name</h3>
    <Input
      bind:value={name}
      placeholder="amazing-room"
      submitted={() => save && save()}
      readonly={room.power.me < room.power.forState("m.room.name")}
    />
  </div>
  <div class="section">
    <h3 class="title">Room Topic</h3>
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
    <p><b>Room Id:</b> <code style="user-select: all">{room?.id}</code></p>
    <p><b>Room Version:</b> <code style="user-select: all">{room.getState("m.room.create")?.content.room_version ?? "no m.room.create!"}</code></p>
  </div>
  {/if}
</div>
