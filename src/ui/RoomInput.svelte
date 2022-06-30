<script>
let value = "";
$: if (value.endsWith('\n')) {
  console.log("submit")
}
</script>
<style>
.input {
  padding: 12px;
  margin: 0 16px;
  border-radius: 8px;
  background: #40444b;
}

.input textarea {
  font: inherit;
  background: none;
  color: var(--fg-content);
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  resize: none;
}
</style>
<div class="input">
  <textarea rows="1" bind:value={value}></textarea>
</div>
