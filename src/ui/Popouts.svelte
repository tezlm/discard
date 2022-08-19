<script>
import Emoji from "./molecules/Emoji.svelte";
let popout = state.popout;
</script>
<style>
.emoji {
  display: none;
  pointer-events: auto;
}
</style>
<div class="emoji" style:display={$popout.id === "emoji" ? "block" : "none"}>
  <Emoji />
</div>
