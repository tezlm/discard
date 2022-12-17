<script>
import hljs from "highlight.js";
export let lang;
export let text;

function getHtml(lang, code) {
  return hljs.highlight(code, { language: hljs.getLanguage(lang) ? lang : "text" });
}
</script>
<pre>{@html getHtml(lang, text)}</pre>
