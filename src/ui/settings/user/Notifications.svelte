<script>
import Toggle from "../../atoms/Toggle.svelte";
import { highlight } from "prismjs";
let accountData = state.accountData;
</script>
<p>todo: show a way to edit notifications similar to element</p>
<p>todo: show notificaton bubble, play notification sound toggles</p>
<div>
<Toggle />
</div>
<br />
<pre><code>{@html highlight(JSON.stringify($accountData.get("m.push_rules"), null, 4), Prism.languages.js, "js")}</code></pre>
<br />
<br />
<br />
<br />
