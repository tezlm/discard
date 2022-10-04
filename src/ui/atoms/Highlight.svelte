<script>
import hljs from "highlight.js";
export let lang;
export let text;

function getHtml(lang, code) {
  return highlight(hljs.getLanguage(lang) ? lang : "text", code);
}
</script>
<pre>{@html getHtml(lang, text)}</pre>
