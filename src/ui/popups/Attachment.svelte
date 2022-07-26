<script>
import Popup from "../atoms/Popup.svelte";
export let current;
</script>
<style>
img {
  max-height: 70vh;
  max-width: 70vw;
}

.original {
  position: absolute;
  top: 100%;
  left: 0;

  color: var(--fg-notice);
  font-size: 14px;
  font-weight: 500;
  opacity: .5;
  transition: opacity .15s;
}

.original:hover {
  opacity: 1;
}
</style>
<Popup raw>
  <div slot="content">
    <img src={current.url} />
    <a href={current.url} class="original">Open original</a>
  </div>
</Popup>
