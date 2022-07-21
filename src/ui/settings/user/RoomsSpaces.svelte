<script>
import Toggle from "../../atoms/Toggle.svelte";
// TODO: live update settings
</script>
<style>
.setting {
  display: flex;
  justify-content: space-between;
}

.setting > div {
  font-weight: 500;
}
</style>
<div class="setting">
  <div>Automatically join suggested rooms</div>
  <Toggle checked={state.settings.get("autojoin")} toggled={(val) => state.settings.put("autojoin", val)} />
</div>
