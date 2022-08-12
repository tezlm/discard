<script>
import Radio from "../../atoms/Radio.svelte";
</script>
<div class="title">Select a language</div>
<Radio options={[
  { id: "en", name: "English" },
]} selected="en" />
<hr />
TODO:
<ul>
  <li>add internationalization support</li>
  <li>get people to translate stuff</li>
</ul>
