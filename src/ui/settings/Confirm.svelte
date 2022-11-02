<script>
import Button from "../atoms/Button.svelte";
import { backInOut } from "svelte/easing";
export let save;
export let reset;
let saving = false;
let { settings } = state;

function fly() {
  return {
    duration: 500,
    easing: backInOut ,
    css: (t) => $settings.get("reducemotion") ? `opacity: ${t}` : `transform: translateY(${72 - t * 72}px)`,
  }
}
</script>
<style>
.wrapper {
  position: sticky;
  bottom: 0;
  flex: 1;
}

.modified {
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 22px;
  padding: 8px;
  width: 100%;
  background: var(--bg-spaces);
  box-shadow: var(--shadow-popup);
  border-radius: 4px;
}

.label {
  flex: 1;
  color: var(--fg-notice);
  padding: 4px;
}
</style>
<div class="wrapper" transition:fly={{ y: 50, duration: 200 }}>
  <div class="modified">
    <div class="label">
      Careful, you have unsaved changes!
    </div>
    <Button type="link small" label="Reset" clicked={reset} />
    <Button type="good small" label="Save Changes" clicked={() => { saving = true; save().then(() => saving = false) }} loading={saving} />
  </div>
</div>
