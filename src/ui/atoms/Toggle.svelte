<script>
export let checked = false;
export let toggled = () => {};
</script>
<style>
.toggle {
  display: block;
  position: relative;
  height: 24px;
  width: 40px;
  background: var(--fg-dim);
  border-radius: 16px;
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle .slider {
  position: absolute;
  top: 3px;
  left: 3px;
  height: 18px;
  width: 18px;
  background: var(--fg-notice);
  border-radius: 50%;
  transition: all 200ms;
}

.toggle.checked {
  background: var(--color-green);
}

.slider.checked {
  left: calc(100% - 18px - 3px);
}
</style>
<label class="toggle" class:checked>
  <input type="checkbox" bind:checked on:change={() => toggled(checked)}>
  <div class="slider" class:checked></div>
</label>
