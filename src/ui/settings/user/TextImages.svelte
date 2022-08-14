<script>
import Toggle from "../../atoms/Toggle.svelte";
import Radio from "../../atoms/Radio.svelte";
let settings = state.settings;
// TODO: dry with other settings
</script>
<style>
.setting {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.setting > div {
  font-weight: 500;
}
</style>
<div class="title">Text box</div>
<div class="setting">
  <div>Send typing notifications</div>
  <Toggle checked={$settings.get("sendtyping")} toggled={(val) => $settings.put("sendtyping", val)} />
</div>
<div class="setting">
  <div>Show autocomplete box</div>
  <Toggle checked={$settings.get("autocomplete")} toggled={(val) => $settings.put("autocomplete", val)} />
</div>
<div style="height: 1em"></div>
<div class="title">Show embeds</div>
<Radio
  options={[
    { name: "Always", id: "always" },
    { name: "In unencrypted rooms", id: "unencrypted" },
    { name: "Never", id: "never" },
  ]}
  selected={$settings.get("showembeds")}
  changed={(id) => $settings.put("showembeds", id)}
/>
<br />
