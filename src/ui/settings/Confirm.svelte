<script>
import Button from "../atoms/Button.svelte";
import { fly } from "svelte/transition";
export let save;
export let cancel = todo;

// TODO: actual in/out animation
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
  font-weight: 500;
  color: var(--fg-notice);
  padding: 4px;
}
</style>
<div class="wrapper" transition:fly={{ y: 50, duration: 200 }}>
  <div class="modified">
    <div class="label">
      Careful, you have unsaved changes!
    </div>
    <Button type="link small" label="Cancel" clicked={cancel} />
    <Button type="good small" label="Save Changes" clicked={save} />
  </div>
</div>
