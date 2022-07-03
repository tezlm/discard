<script>
import Input from "../../atoms/Input.svelte";
import Button from "../../atoms/Button.svelte";
import Textarea from "../../atoms/Textarea.svelte";

let focusedSpace = state.focusedSpace;
let space = state.client.getRoom($focusedSpace);
$: topic = space.currentState.getStateEvents("m.room.topic")[0]?.getContent().topic;
</script>
<style>
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
  color: var(--fg-dim);
  font-size: 14px;
  cursor: pointer;
}

.side {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.side > .note {
  color: var(--fg-light);
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 10px;
}

.name {
  flex: 1;
  margin-left: 10px;
}

.info {
  color: var(--fg-light);
  font: 0.7em var(--font-display);
  font-weight: bold;
}

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
    <div class="avatar">
      <div class="uploader">
        <img src={space.getAvatarUrl(state.client.baseUrl)} />
        <div class="info remove">Remove</div>
      </div>
      <div class="side">
        <div class="note">todo: add some helpful text.</div>
        <div><Button label="Upload Image" type="hollow" /></div>
      </div>
    </div>
    <div class="name">
      <div class="title">Space Name</div>
      <Input value={space.name} />
    </div>
  </div>
  <div class="section" style="flex-direction: column">
    <div class="title">Space Topic</div>
    <Textarea placeholder="what an excellent space" value={topic} />
  </div>
</div>
