<script>
import Toggle from "../../atoms/Toggle.svelte";
import Radio from "../../atoms/Radio.svelte";
// TODO: live update settings
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
  <Toggle checked={state.settings.get("sendtyping")} toggled={(val) => state.settings.put("sendtyping", val)} />
</div>
<div class="setting">
  <div>Show autocomplete box</div>
  <Toggle checked={state.settings.get("autocomplete")} toggled={(val) => state.settings.put("autocomplete", val)} />
</div>
<br />
<div class="title">Show embeds</div>
<Radio
  options={[
    { name: "Always", id: "always" },
    { name: "In unencrypted rooms", id: "unencrypted" },
    { name: "Never", id: "never" },
  ]}
  selected={state.settings.get("showembeds")}
  changed={(id) => state.settings.put("showembeds", id)}
/>
<br />
