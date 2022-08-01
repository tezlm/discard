<script>
import Toggle from "../../atoms/Toggle.svelte";
let settings = state.settings;
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
  <Toggle checked={$settings.get("autojoin")} toggled={(val) => $settings.put("autojoin", val)} />
</div>
