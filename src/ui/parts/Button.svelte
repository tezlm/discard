<script>
export let type = "normal";
export let label = "button";
export let clicked = () => {};
</script>
<style>
button {
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: none;
  color: inherit;
  background: #202225;
  cursor: pointer;
}
</style>
<button type={type} on:click={clicked}>{label}</button>
