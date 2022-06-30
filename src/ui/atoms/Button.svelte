<script>
export let type = "normal";
export let label = "button";
export let clicked = () => {};
</script>
<style>
button {
  font: inherit;
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: none;
  color: inherit;
  cursor: pointer;
}

.normal {
  background: #202225;
}

.primary {
  background: #7289da;
}
</style>
<button type={type} class={type} on:click={clicked}>{label}</button>
