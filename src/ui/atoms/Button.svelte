<script>
export let type = "normal";
export let label = "button";
export let clicked = () => {};
</script>
<style>
button {
  font: inherit;
  border-radius: 3px;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
}

.big {
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
}

.normal {
  background: var(--bg-misc);
}

.primary {
  background: var(--color-accent);
}

.hollow {
  background: transparent;
  border: solid var(--button-outline) 1px;
  transition: all 170ms;
}

.hollow:hover {
  background: var(--button-outline);
}
</style>
<button class={type} on:click={clicked}>{label}</button>
