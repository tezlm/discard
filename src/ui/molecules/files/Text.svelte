<script>
import File from "./File.svelte";
// import hljs from "highlight.js";
export let src;
export let name = "title";
export let size = 0;
export let mime;

// TODO: make this work properly

// async function fetchFile() {
  // const req = await fetch(src);
  // const text = await req.text();
  // return text.split("\n").slice(0, 10).join("\n");
// }

// function getType(mime) {
//   if (!mime) return null;
//   if (mime === "application/x-javascript") return "js";
//   if (mime === "application/json") return "js";
//   return mime.split("/")[1];
// }

// function getLang(mime) {
  // return Prism.languages[getType(mime)] ?? Prism.languages.plain;
// }
</script>
<File {src} {name} {size}>
  <!-- this will cause the element to resize
  {#await fetchFile() then file}
  <pre><code>{@html highlight(file, getLang(mime), getType(mime))}</code></pre>
  {/await}
  -->
</File>
