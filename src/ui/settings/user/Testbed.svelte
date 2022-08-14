<script>
import Markdown from "../../molecules/Markdown.svelte";
import Autocomplete from "../../molecules/Autocomplete.svelte";
import { parseMxc } from "../../../util/content.js";
let input = "";
let embed = {
  "url": "https://www.freecodecamp.org/news/what-is-open-graph-and-how-can-i-use-it-for-my-website/",
  "og:site_name": "freeCodeCamp.org",
  "og:type": "article",
  "og:title": "What is Open Graph and how can I use it for my website?",
  "og:description": "It can take a lot of time to bu" + "ild content and maintain a website. How can we make sure our content stands out when getting shared on social feeds around the internet? * What is Open Graph? * Why do I need it? * What happens if",
  "og:url": "https://www.freecodecamp.org/news/what-is-open-graph-and-how-can-i-use-it-for-my-website/",
  "og:image:width": 2000,
  "og:image:height": 769,
  "og:label1": "Written by",
  "og:data1": "Colby Fayock",
  "og:label2": "Filed under",
  "og:data2": "Web Development, Tech, HTML, Social Media, Content Marketing, Digital Marketing, Marketing, Open Graph",
  "og:image": "mxc://matrix.org/2022-07-24_AXfpqKpifIpexgWb",
  "og:image:type": "image/jpeg",
  "matrix:image:size": 63761
}
</script>
<style>
.embed {
  display: inline-block;
  background: var(--bg-rooms-members);
  padding: 8px 12px 16px;
  border-radius: 4px;
  border-left: solid var(--bg-spaces) 4px;
  max-width: 440px;
}

.embed > * {
  display: block;
  margin-top: 8px;
}

.embed .sitename {
  color: var(--fg-light);
  font-size: 14px;
}

.embed .description {
  font-size: 14px;
}

.embed img {
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}
</style>
<p>testbed for random stuff</p>
<div style="height: 1em"></div>
<Markdown bind:content={input} />
<div style="height: 1em"></div>
{#if input[0] === "/" || input[0] === "@"}
<Autocomplete {input} />
{/if}
<div style="height: 1em"></div>
<div class="embed">
  {#if embed["og:site_name"]}
  <a class="sitename" href="https://youtube.com/">{embed["og:site_name"]}</a>
  {/if}
  <h4><a href={embed["url"]}>{embed["og:title"]}</a></h4>
  {#if embed["og:description"]}
  <div class="description">{embed["og:description"]}</div>
  {/if}
  {#if embed["og:image"]}
  <img src={parseMxc(embed["og:image"])} on:click={() => state.popup.set({ id: "attachment", url: parseMxc(embed["og:image"]) })}/>
  {/if}
</div>
