<script>
import { formatSize } from "../../../util/format.js";
import fileIcon from "../../../assets/file.svg";
import downloadIcon from "../../../assets/icons/download.svg";
export let src;
export let name = "title";
export let size = 0;
</script>
<style>
.file {
  display: inline-flex;
  flex-direction: column;
  padding: .5rem;
  background: var(--bg-rooms-members);
  border: solid var(--bg-misc) 1px;
  border-radius: 3px;
}

.header {
  display: flex;
  align-items: center;
  height: 42px;
}

.header img {
  height: 100%;
}

.header .info {
  padding: 0 1em;
  display: flex;
  flex-direction: column;
}

.header .info > .size {
  color: var(--fg-dim);
  font-size: .8rem;
}

.download {
  display: flex;
  margin-left: auto;
  cursor: pointer;
  filter: invert(100%) brightness(.7);
}

.download:hover {
  filter: invert(100%) brightness(.85);
}

.download img {
  height: 28px;
}
</style>
<div class="file">
  <div class="header">
    <img src={fileIcon} alt="file icon" />
    <div class="info">
      <a href={src}>{name}</a><br />
      <span class="size">{formatSize(size)}</span>
    </div>
    <a class="download" href={src} download={name}>
      <img src={downloadIcon} alt="download" />
    </a>
  </div>
  <slot></slot>
</div>
