<script>
import Input from "../../atoms/Input.svelte";
import Button from "../../atoms/Button.svelte";
import Textarea from "../../atoms/Textarea.svelte";
export let room;
</script>
<style>
.title {
  color: var(--fg-light);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: solid #4F545C7b 1px;
}

.section:last-child {
  padding-bottom: none;
  margin-bottom: none;
  border-bottom: none;
}

.separator {
  width: 202px;
  height: 1px;
  margin: 8px auto;
  background: #4F545C7b;
}
</style>
<div>
  <div class="section">
    <div class="title">Room Name</div>
    <Input value={$room?.name ?? "error"} />
  </div>
  <div class="section">
    <div class="title">Room Topic</div>
    <Textarea placeholder="what an amazing room" value={$room?.topic ?? ""} />
  </div>
  <div class="section">
    <div class="title">Developers</div>
    <p><b>Room Id:</b> <code style="user-select: all">{$room?.roomId}</code></p>
  </div>
</div>
