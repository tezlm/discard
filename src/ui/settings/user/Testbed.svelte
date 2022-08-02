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
  min-width: 430px;
  max-width: 800px;
}

.option {
  border-radius: 5px;
  padding: 8px;
}

.option:hover {
  background: var(--bg-content);
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
<div on:contextmenu={(e) => {
  e.preventDefault();
  // TODO: split out into state and actions
  // TODO: if context menu is too low down, move it up
  context = {
    x: e.x,
    y: e.y,
  };
}}>
  right click
</div>
<br />
<Context items={[
  { label: "Profile", clicked: todo, icon: "person" },
  { label: "Mention", clicked: todo, icon: "notifications" },
  { label: "Message", clicked: todo, icon: "message" },
  { label: "Block",   clicked: todo, icon: "block" },
  null,
  { label: "Remove Messages", clicked: () => state.popup.set({ id: "deleterecent", room: { roomId: null }, member: { name: "yes" } }), icon: "delete",        color: "var(--color-red)" },
  { label: "Kick [user]",     clicked: () => state.popup.set({ id: "kick",         room: { roomId: null }, member: { name: "yes" } }), icon: "person_remove", color: "var(--color-red)" },
  { label: "Ban [user]",      clicked: () => state.popup.set({ id: "ban",          room: { roomId: null }, member: { name: "yes" } }), icon: "person_remove", color: "var(--color-red)" },
  null,
  { label: "Power",   clicked: todo, submenu: [] },
  null,
  { label: "Copy ID", clicked: todo, icon: "terminal" },
]} />
<br />
<Context x={200} items={[
  { label: "Mark As Read",  clicked: todo, icon: "done" },
  { label: "Notifications", clicked: todo, submenu: [
    { label: "Foo", clicked: todo },
    { label: "Bar", clicked: todo },
    { label: "Baz", clicked: todo },
  ] },
  null,
  { label: "Settings", clicked: todo, submenu: [
    { label: "Foo", clicked: todo },
    { label: "Bar", clicked: todo },
    { label: "Baz", clicked: todo },
  ] },
  null,
  { label: "Invite",    clicked: todo, icon: "person_add", color: "var(--color-accent)" },
  { label: "Copy Link", clicked: todo, icon: "link" },
  null,
  { label: "Leave",   clicked: todo, icon: "logout", color: "var(--color-red)" },
  null,
  { label: "Copy ID", clicked: todo, icon: "terminal" },
]} />
<br />
<div class="autocomplete">
  <h3>Commands matching <b>/</b></h3>
  <div class="option">/shrug [message]</div>
  <div class="option">/kick [user] (reason)</div>
  <div class="option">/part</div>
</div>
<br />
