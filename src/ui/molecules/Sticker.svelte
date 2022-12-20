<script>
import Button from "../../atoms/Button.svelte";
let { popup } = state;
</script>
<style>
.sticker-popout {
  position: absolute;
  left: 128px;
  top: 24px;

  display: inline-flex;
  width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.sticker-popout > img {
  margin-right: 16px;
}

.sticker-popout > div {
  display: flex;
  flex-direction: column;
}
</style>
<div class="sticker-popout">
  <img
    src={parseMxc(content.url, dimensions.width, dimensions.height)}
    alt={content.body}
    title={content.body}
    style={dimensions.css}
    on:click={() => $popup = { id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) }}
  />
  <div>
    <b>{content.body}</b>
    <span>maybe some additional metadata or info can be here...</span>
    <div style="height:16px"></div>
    <Button label="steal" type="primary" on:click={todo} />
  </div>
</div>

