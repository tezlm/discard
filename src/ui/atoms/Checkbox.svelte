<script lang="ts">
export let checked = false;
export let toggled = (_: boolean) => {};
</script>
<style>
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid var(--bg-spaces) 2px;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.checkbox.checked {
  background: var(--color-accent);
  border: solid var(--color-accent) 2px;
}

.checkbox input {
  display: none;
}

.checkbox .icon {
  font-weight: 700;
}
</style>
<label class="checkbox" class:checked>
  <input type="checkbox" bind:checked on:change={() => toggled(checked)}>
  {#if checked}
  <div class="icon">check</div>
  {/if}
</label>
