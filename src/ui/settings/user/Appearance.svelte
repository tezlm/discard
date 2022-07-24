<script>
import Radio from "../../atoms/Radio.svelte";
import Toggle from "../../atoms/Toggle.svelte";
// TODO: live update settings
const opts = state.settings;
</script>
<style>
.option {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
<div class="preview">
  <!-- TODO: preview message -->
</div>
<br />
<div class="title">User colors</div>
<Radio
  options={[["Always", "always"], ["If they have a power level", "power"], ["Never", "never"]]}
  selected={opts.get("namecolors")}
  changed={(op) => opts.put("namecolors", op)}
/>
<br />
<div class="title">Room timeline</div>
<div class="option">
  <b>Show join and leaves</b>
  <Toggle checked={opts.get("showjoinleave")} toggled={(val) => opts.put("showjoinleave", val)}/>
</div>
<div class="option">
  <b>Show invites, kicks, bans, and unbans</b>
  <Toggle checked={opts.get("showmembership")} toggled={(val) => opts.put("showmembership", val)}/>
</div>
<div class="option">
  <b>Show name and avatar changes</b>
  <Toggle checked={opts.get("shownickavatar")} toggled={(val) => opts.put("shownickavatar", val)}/>
</div>
<div class="option">
  <b>Show room name and topic changes</b>
  <Toggle checked={opts.get("shownametopic")} toggled={(val) => opts.put("shownametopic", val)}/>
</div>
<br />
