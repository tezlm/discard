<script>
import Markdown from "../../molecules/Markdown.svelte";
import Context from "../../atoms/Context.svelte";
import { parseMxc } from "../../../util/content.js";
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
.autocomplete {
  background: var(--bg-rooms-members);
  border-radius: 5px;
  box-shadow: var(--shadow-popup);
  overflow: hidden scroll;
  padding: 8px;
  max-height: 300px;
}

.option {
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 8px;
}

.option:hover {
  background: var(--bg-content);
}

.option .name::before {
  content: "/";
  margin-right: 8px;
  font-weight: 700;
  color: var(--fg-dim);
}

.option .name {
  font-weight: 500;
}

.option .description {
  color: var(--fg-dim);
  font-size: 14px;
  margin-left: auto;
}

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
<br />
<Markdown />
<br />
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
<br />
<br />
<div class="autocomplete scroll">
  <div class="title">Commands</div>
  <div class="option">
    <div class="name">shrug</div>
    <div class="description">Prepends ¯\_(ツ)_/¯ to your message</div>
  </div>
  <div class="option">
    <div class="name">me</div>
    <div class="description">Sends your text with emphasis</div>
  </div>
  <div class="option">
    <div class="name">part</div>
    <div class="description">Leave the room</div>
  </div>
  <div class="option">
    <div class="name">join</div>
    <div class="description">Join a room</div>
  </div>
  <div class="option">
    <div class="name">invite</div>
    <div class="description">Invite someone to the room</div>
  </div>
  <div class="option">
    <div class="name">kick</div>
    <div class="description">Kick someone from the room</div>
  </div>
  <div class="option">
    <div class="name">ban</div>
    <div class="description">Ban someone from the room</div>
  </div>
  <div class="option">
    <div class="name">msg</div>
    <div class="description">Message someone</div>
  </div>
  <div class="option">
    <div class="name">plain</div>
    <div class="description">Send a message without formatting</div>
  </div>
  <div class="option">
    <div class="name">html</div>
    <div class="description">Send a message as html</div>
  </div>
  <div class="option">
    <div class="name">spoiler</div>
    <div class="description">Send a message as a spoiler</div>
  </div>
  <div class="option">
    <div class="name">nick</div>
    <div class="description">Change your nickname for this room</div>
  </div>
</div>
<br />
