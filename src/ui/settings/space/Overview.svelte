<script>
import { parseMxc } from "../../../util/content.js";
import Input from "../../atoms/Input.svelte";
import Button from "../../atoms/Button.svelte";
import Textarea from "../../atoms/Textarea.svelte";
import Confirm from "../Confirm.svelte";
export let room;
let name = $room?.name ?? "";
let topic = $room?.topic ?? "";
$: changed = (name !== ($room?.name ?? ""))
  || (topic !== ($room?.topic ?? ""));
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
</style>
<h1>Space Overview</h1>
<div>
  <div class="section" style="flex-direction: row">
    <div class="avatar">
      <div class="uploader">
        <!-- TODO: generate default avatars -->
        <img src={parseMxc($room.avatar) ?? "https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"} />
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
  </div>
</div>
{#if changed}
<Confirm />
{/if}
