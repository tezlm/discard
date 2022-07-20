<script>
import Radio from "../../atoms/Radio.svelte";
// TODO: live update settings
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
</style>
<div class="preview">
  <!-- TODO: preview message -->
</div>
<div class="title">User colors</div>
<Radio
  options={[["Always", "always"], ["If they have a power level", "power"], ["Never", "never"]]}
  selected={state.settings.get("namecolors")}
  changed={(op) => state.settings.put("namecolors", op)}
/>
<br>
<p>todo, low priority: show/hide join, leave, invite, nick/avatar change, room name/topic change</p>
