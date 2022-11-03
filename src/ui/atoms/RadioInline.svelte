<script>
export let group;
export let value;
export let disabled;
</script>
<style>
.radio input {
  display: none;
}

.radio .dot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  margin-right: 16px;
  border: solid var(--fg-interactive) 1px;
  border-radius: 50%;
  cursor: pointer;
}

.radio .dot.selected {
  background: var(--color-green);
  border: solid var(--color-green) 1px;
}

.radio .dot.selected > div {
  font-weight: 700;
  font-size: 18px;
  color: var(--fg-notice);
}
</style>
<label class="radio">
  <input type="radio" bind:group {value} {disabled} />
  <div class="dot" class:selected={group === value}>
    {#if group === value}
    <div class="icon">check</div>
    {/if}
  </div>
</label>
