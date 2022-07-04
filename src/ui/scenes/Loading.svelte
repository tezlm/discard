<script>
export let text = "syncing...";
$: chars = text.split("");
</script>
<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  background: var(--bg-spaces);
}

.text {
  margin-top: 1em;
  text-align: center;
  font-weight: 500;
  font-family: var(--display);
}

.hover {
  animation: hover 3s infinite ease-in-out;
  display: inline-block;
}

@keyframes hover {
  0% { transform: translateY(5px) }
  50% { transform: translateY(-5px) }
  100% { transform: translateY(5px) }
}
</style>
<div class="wrapper">
  <div class="text">
    {#each chars as char, i}
      <span class="hover" style="animation-delay: {i * -80}ms">{char}</span>
    {/each}
  </div>
</div>
