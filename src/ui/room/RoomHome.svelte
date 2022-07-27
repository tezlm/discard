<script>
import Button from "../atoms/Button.svelte";
import Input from "../atoms/Input.svelte";
// import Tooltip from "../atoms/Tooltip.svelte";
import { parseHtml } from "../../util/html.js";
import { parseMxc } from "../../util/content.js";
let space = state.focusedSpace;
let members = false;

// TODO: split user home and space home into separate files

$: {
  if ($space?.members.fetched) {
    members = $space.members.with("join");  
  } else {
    members = false;
    $space?.members.fetch().then(() => {
      members = $space.members.with("join");  
    });  
  }
}
  
function formatJoinRule(rule) {
  switch(rule) {
    case "public": return "Public";
    case "invite": return "Private";
    case "restricted": return "Restricted";
  }
}
</script>
<style>
.content {
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 32px;
  overflow-y: scroll;
  background: #2c2e33;
}

.home {
  background: none;
}

.main {
  max-width: 600px;
  width: 100%;
  margin: 0 16px;
}

.side {
  width: 100%;
  max-width: 320px;
  margin: 36px 16px;
}

.side > div {
  background: var(--bg-content);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.header {
  position: relative;
  user-select: text;
}

.header img {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
}

.header h1 {
  overflow-wrap: anywhere;
  font-size: 24px;
}

.header .info {
  margin: .5rem 0;
  color: var(--fg-light);
  font-weight: 500;
}

.header .topic {
  line-height: 1.3;
}

.placeholder {
  background: var(--bg-rooms-members);
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<div class="content" class:home={!$space}>
  {#if $space}
  <div class="main"> 
    <h3>Rooms</h3>
    <div style="height: 16px"></div>
    <Input placeholder="Search..." />
    <div style="height: 16px"></div>
    <div class="placeholder">
      <div>// TODO</div>
    </div>
  </div>
  <div class="side">
    <div class="header">
      <img src={parseMxc($space.avatar)} />
      <div style:height="24px"></div>
      <h1>{$space.name}</h1>
      <div class="info">
        {formatJoinRule($space.joinRule)} space ·
        {members?.length ?? "???"} {members?.length === 1 ? "member" : "members"} ·
        <a href="#" on:click={(e) => { e.preventDefault(); state.selectedRoom.set($space); state.scene.set("space-settings") }}>edit</a>
      </div>
      <div class="topic">{@html $space.topic ? parseHtml($space.topic, { linkify: true }) : "<i>no topic</i>"}</div>
    </div>
    <div>
      <h3>Active now</h3>
      <br />
      <ul>
        <li>todo</li>
        <li>todo</li>
        <li>todo</li>
      </ul>
    </div>
  </div>
  {:else}
  <div>
    <Button type="normal" label="Create Space" clicked={() => state.popup.set({ id: "create", type: "space" })} />
    <Button type="primary" label="Create Room" clicked={() => state.popup.set({ id: "create", type: "room" })} />
  </div>
  {/if}
</div>
