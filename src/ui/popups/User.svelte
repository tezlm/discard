<script>
import Popup from "../atoms/Popup.svelte";
import Avatar from "../atoms/Avatar.svelte";
export let current;
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
  padding: 8px;
  margin: 0;
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
    <div class="header">
      <Avatar size={72} user={current.user} />
      <div style="margin-left: 12px;">
        <h2>{current.user.name}</h2>
        <span>{current.user.userId}</span>
      </div>
    </div>
    <div class="info">
      more text here, foo bar baz
    </div>
  </div>
</Popup>
