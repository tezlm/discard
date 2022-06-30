<script>
export let type = "text";
export let value = "";
export let placeholder = "";
</script>
<style>
input {
  font-family: var(--font-primary);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border: none;
  color: inherit;
  background: #202225;
  outline: none;
}
</style>
<input type={type} value={value} placeholder={placeholder} />
