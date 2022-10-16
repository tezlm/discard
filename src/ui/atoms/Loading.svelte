<script>
export let text = "loading...";
$: chars = text.split("");
</script>
<style>
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

.loader {
  /*
  width: 100px;
  height: 100px;
  background: conic-gradient(var(--mxid-2), var(--mxid-3), var(--mxid-4), var(--mxid-5), var(--mxid-2));
  border-radius: 50%;
  animation: spin 1.3s infinite cubic-bezier(.4,-0.17,.53,1.14);
  */
}

@keyframes spin {
  from { transform: rotate(0) }
  to { transform: rotate(3turn) }
}
</style>
<div class="text">
  {#each chars as char, i}
    <span class="hover" style="animation-delay: {i * -80}ms">{char}</span>
  {/each}
</div>
<!--
<svg class="loader" height=300 width=300>
  <linearGradient id="color">
    <stop offset="0%" stop-color="var(--mxid-1)" />
    <stop offset="33%" stop-color="var(--mxid-2)" />
    <stop offset="67%" stop-color="var(--mxid-3)" />
    <stop offset="100%" stop-color="var(--mxid-4)" />
  </linearGradient>
  <path d="M 50 50 A 50 50 0 1 0 100 150" stroke="url(#color)" stroke-width="10" fill="none" />
</svg>
-->