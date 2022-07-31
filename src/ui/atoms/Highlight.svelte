<script>
import { highlight, languages } from "prismjs";
export let lang;
export let text;

function getHtml(lang, text) {
  const exists = Object.hasOwnProperty(languages, lang);
  return highlight(text, exists ? languages[type] : languages.plain, exists ? type : "plain");
}
</script>
<pre>{@html getHtml(lang, text)}</pre>
