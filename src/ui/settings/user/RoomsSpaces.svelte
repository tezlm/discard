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
  <Toggle checked={$settings.get("autospace")} toggled={(val) => $settings.put("autospace", val)} />
</div>
<div class="setting">
  <div>Automatically accept dms</div>
  <Toggle checked={$settings.get("autodm")}    toggled={(val) => $settings.put("autodm", val)} />
</div>
