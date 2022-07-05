<script>
import Loading from "../atoms/Loading.svelte";
</script>
<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  background: var(--bg-spaces);
}
</style>
<div class="wrapper">
  <Loading text="syncing..." />
</div>
