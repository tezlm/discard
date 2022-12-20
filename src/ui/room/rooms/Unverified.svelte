<script>
import Button from "../../atoms/Button.svelte";
export let room;
</script>
<style>
.wrapper {
  position: relative;
  margin: auto;
  text-align: center;
}

.icon {
  position: absolute;
  top: -108px;
  left: 50%;
  margin: 16px 0;
  font-size: 72px;
  color: var(--fg-muted);
  transform: translateX(-50%);
}
</style>
<div class="wrapper">
  <div class="icon">lock</div>
  <h1>Encrypted Room</h1>
  <p style="margin-top: 16px">Verify your current session to read encrypted messages!</p>
  <br />
  <Button type="primary" label="Verify Session" on:click={todo} />
</div>
