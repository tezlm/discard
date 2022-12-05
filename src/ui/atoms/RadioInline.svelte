<script>
export let group;
export let value;
export let disabled = false;
export let clicked;

function handleKeyDown(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  group = value;
  clicked?.(value);
}
</script>
<style>
.radio input {
  display: none;
}

.radio:focus {
  outline: none;
}

.radio:focus .dot {
  outline: solid var(--color-accent) 3px;
}

.radio .dot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
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
<label tabindex="0" class="radio" on:keydown={handleKeyDown}>
  <input type="radio" bind:group {value} {disabled} on:input={() => clicked?.(value)} />
  <div class="dot" class:selected={group === value}>
    {#if group === value}
    <div class="icon">check</div>
    {/if}
  </div>  
</label>
