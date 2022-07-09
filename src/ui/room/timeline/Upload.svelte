<script>
import { formatSize } from "../../../util/format.js";
import fileIcon from "../../../assets/file.svg";
export let upload;
console.log("upload", upload)
$: file = upload.file;
</script>
<style>
.file {
  background: var(--bg-rooms-members);
  border: solid var(--bg-spaces) 1px;
  border-radius: 3px;
  display: flex;
  padding: .5rem;
  margin: 2px 72px;
  height: 60px;
  width: fit-content;
}

.info {
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
</style>
<div class="file">
  <img src={fileIcon} alt="file icon" />
  <div class="info">
    <div>{file.name ?? "unknown"} - <span class="size">{formatSize(file.size)}</span></div>
    <div class="progress">
      <div class="bar" style:width="{upload.progress * 300}px"></div>
    </div>
  </div>
</div>
