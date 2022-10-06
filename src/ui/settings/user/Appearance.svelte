<script>
import Radio from "../../atoms/Radio.svelte";
import Toggle from "../../atoms/Toggle.svelte";
const settings = state.settings;
// TODO: make appearance specifically about discard's appearance (don't change functionality)
</script>
<style>
.option {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
<pre>
TODO: preview messages
</pre>
<div style="height: 1em"></div>
<div class="title">User colors</div>
<Radio
  options={[
    { name: "Always", id: "always"},
    { name: "If they have a power level", id: "power"},
    { name: "Never", id: "never"}
  ]}
  selected={$settings.get("namecolors")}
  changed={(id) => $settings.put("namecolors", id)}
/>
<div style="height: 1em"></div>
<div class="title">Room timeline</div>
<!-- "show member events in public rooms" -->
{#each [
  ["Show join and leaves", "showjoinleave"],
  ["Show name and avatar changes", "shownickavatar"],
] as [name, setting]}
<div class="option">
  <b>{name}</b>
  <Toggle checked={$settings.get(setting)} toggled={(val) => $settings.put(setting, val)}/>
</div>
{/each}
