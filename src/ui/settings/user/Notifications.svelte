<script>
import hljs from "highlight.js";
let accountData = state.accountData;
</script>
<p>todo: show a way to edit notifications similar to element</p>
<p>todo: show notificaton bubble, play notification sound toggles</p>
<br />
<pre><code>{@html hljs.highlight("json", JSON.stringify($accountData.get("m.push_rules"), null, 4)).value}</code></pre>
<br />
<br />
<br />
<br />
