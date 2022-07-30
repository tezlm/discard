<script>
import Input from "../../atoms/Input.svelte";
import Textarea from "../../atoms/Textarea.svelte";
export let room;
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
    <div class="title">Room Name</div>
    <Input value={$room?.name ?? "error"} placeholder="amazing-room" readonly={$room.power.me < $room.power.getState("m.room.name")} />
  </div>
  <div class="section">
    <div class="title">Room Topic</div>
    <Textarea value={$room?.topic ?? ""} placeholder="what an amazing room" readonly={$room.power.me < $room.power.getState("m.room.topic")} />
  </div>
  <div class="section">
    <div class="title">Developers</div>
    <p><b>Room Id:</b> <code style="user-select: all">{$room?.roomId}</code></p>
    <p><b>Room Version:</b> <code style="user-select: all">{$room.state.find(i => i.type === "m.room.create")?.content.room_version ?? "no m.room.create!"}</code></p>
  </div>
</div>
