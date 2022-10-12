<script>
import { parseMxc } from "../../../util/content.ts";
import Input from "../../atoms/Input.svelte";
import Button from "../../atoms/Button.svelte";
import Textarea from "../../atoms/Textarea.svelte";
export let room;
export let save = null;
let name, topic, avatar;

export function reset() {
  name = $room?.name ?? "";
  topic = $room?.topic ?? "";  
  avatar = null;
}

reset();

$: {
  let nameChanged = name !== ($room?.name ?? "");
  let topicChanged = topic !== ($room?.topic ?? "");
  if (nameChanged || topicChanged || avatar) {
    save = async () => {
      const proms = [];
      if (nameChanged) proms.push(state.api.sendState($room.id, "m.room.name", "", { name }));
      if (topicChanged) proms.push(state.api.sendState($room.id, "m.room.topic", "", { topic }));
      if (avatar) {
        if (avatar.file) {
          const prom = state.api.uploadFile(avatar.file).promise
            .then(url => state.api.sendState($room.id, "m.room.avatar", "", { url }));
          proms.push(prom);
        } else {
          proms.push(state.api.sendState($room.id, "m.room.avatar", "", { url:  null }));
        }
        avatar = null;
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
  flex: 1;
  display: flex;
}

.avatar .uploader {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

.uploader img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  box-shadow: var(--shadow-high);
}

.uploader > .remove {
  text-align: center;
  margin-top: 10px;
  color: var(--fg-muted);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.uploader > .remove:hover {
  color: var(--fg-light);
}

.side {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.side > .note {
  color: var(--fg-light);
  font-size: 14px;
  margin-bottom: 10px;
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

.avat {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.avat > div {
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

.avat:hover > div {
  opacity: 1;
}
</style>
<h1>Space Overview</h1>
<div>
  <div class="section" style="flex-direction: row">
    <div class="avatar">
      <div class="uploader">
        <!-- TODO: generate default avatars (use Avatar?) -->
        <div class="avat" on:click={todo}>
          <img src={parseMxc($room.avatar) ?? "https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"} />
          <!-- <div>Upload Image</div> -->
          <div class="icon">edit</div>
        </div>
        <div class="remove">Remove</div>
      </div>
      <div class="side">
        <div class="note">todo: add some helpful text.</div>
        <div><Button label="Upload Image" type="hollow" /></div>
      </div>
    </div>
    <div class="name">
      <div class="title">Space Name</div>
      <Input
        bind:value={name}
        placeholder="amazing-room"
        readonly={$room.power.me < $room.power.getState("m.room.name")}
      />
    </div>
  </div>
  <div class="section">
    <div class="title">Space Topic</div>
    <Textarea
      bind:value={topic}
      placeholder="what an amazing room"
      readonly={$room.power.me < $room.power.getState("m.room.topic")}
    />
  </div>
  <div class="section">
    <div class="title">Developers</div>
    <p><b>Room Id:</b> <code style="user-select: all">{$room.roomId}</code></p>
    <p><b>Room Version:</b> <code style="user-select: all">{$room.getState("m.room.create")?.content.room_version ?? "no m.room.create!"}</code></p>
  </div>
</div>
