<script>
import Loading from "../atoms/Loading.svelte";
</script>
<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  background: var(--bg-spaces);
}

.title {
  margin-top: 1em;
}
</style>
<div class="wrapper">
  <Loading color="var(--fg-dim)" />
  <div class="title">syncing...</div>
</div>
