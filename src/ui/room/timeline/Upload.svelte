<script>
import { formatSize } from "../../../util/format.js";
import fileIcon from "../../../assets/file.svg";
export let upload;
$: file = upload.file;
</script>
<style>
.file {
  background: var(--bg-rooms-members);
  border: solid var(--bg-spaces) 1px;
  border-radius: 3px;
  display: inline-flex;
  padding: .5rem;
  margin: 2px 72px;
  height: 60px;
}

.info {
  flex: 1;
  padding: 0 1em;
  display: flex;
  flex-direction: column;
}

.size {
  color: var(--fg-muted);
}

.progress {
  margin-top: 8px;
  width: 300px;
  height: 6px;
  background: var(--color-gray);
  border-radius: 3px;
  overflow: hidden;
}

.bar {
  height: 6px;
  background: var(--color-accent);
  border-radius: 3px;
}

.icon {
  margin: 0;
  font-size: 28px;
  color: var(--fg-dim);
}

.icon:hover {
  color: var(--fg-notice);
}
</style>
<div class="file">
  <img src={fileIcon} alt="file icon" />
  <div class="info">
    <div>{file.name ?? "unknown"} - <span class="size">{formatSize(file.size)}</span></div>
    <div class="progress">
      <div class="bar" style:width="{upload.progress * 300}px"></div>
    </div>
  </div>
  <div class="icon" on:click={() => upload.cancel()}>close</div>
</div>
