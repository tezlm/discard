<script>
import Context from "../../atoms/Context.svelte";
import { parseMxc } from "../../../util/content.js";
let context = null;
let embed = {
  url: "https://www.freecodecamp.org/news/what-is-open-graph-and-how-can-i-use-it-for-my-website/",
  "og:site_name": "freeCodeCamp.org",
  "og:type": "article",
  "og:title": "What is Open Graph and how can I use it for my website?",
  "og:description": "It can take a lot of time to build content and maintain a website. How can we make sure our content stands out when getting shared on social feeds around the internet? * What is Open Graph? * Why do I need it? * What happens if",
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

let embed2 = {
  "og:site_name": "YouTube",
  "og:url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "og:title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  "og:image:width": 480,
  "og:image:height": 360,
  "og:description": "The official video for “Never Gonna Give You Up” by Rick AstleyTaken from the album ‘Whenever You Need Somebody’ – deluxe 2CD and digital deluxe out 6th May ...",
  "og:type": "video.other",
  "og:video:url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "og:video:secure_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "og:video:type": "text/html",
  "og:video:width": 200,
  "og:video:height": 113,
  "og:video:tag": "rick astley never gonna give you up lyrics",
  "og:app:name:iphone": "YouTube",
  "og:app:id:iphone": "544007664",
  "og:app:name:ipad": "YouTube",
  "og:app:id:ipad": "544007664",
  "og:app:url:iphone": "vnd.youtube://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=applinks",
  "og:app:url:ipad": "vnd.youtube://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=applinks",
  "og:app:name:googleplay": "YouTube",
  "og:app:id:googleplay": "com.google.android.youtube",
  "og:app:url:googleplay": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "og:player": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "og:player:width": "1280",
  "og:player:height": "720",
  "og:image": "mxc://matrix.org/2022-07-24_laQOROjcPOScYWkt",
  "og:image:type": "image/jpeg",
  "matrix:image:size": 17560
}
</script>
<style>
.popout {
  width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.popout img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.popout h3 {
  margin-top: 16px;
  font-weight: 500;
  font-family: var(--font-display);
  color: var(--fg-notice);
}

.popout .id {
  color: var(--fg-muted);
  font-size: 14px;
  user-select: all;
}

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
<div class="embed">
  {#if embed2["og:site_name"]}
  <a class="sitename" href="https://youtube.com/">{embed2["og:site_name"]}</a>
  {/if}
  <h4><a href={embed2["url"]}>{embed2["og:title"]}</a></h4>
  {#if embed2["og:description"]}
  <div class="description">{embed2["og:description"]}</div>
  {/if}
  {#if embed2["og:image"]}
  <img src={parseMxc(embed2["og:image"])} on:click={() => state.popup.set({ id: "attachment", url: parseMxc(embed2["og:image"]) })}/>
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
{#if context}
<Context x={context.x} y={context.y} items={[
  { label: "Mark As Read", clicked: todo },
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
  { label: "Invite", clicked: todo, color: "var(--color-accent)" },
  { label: "Copy Link", clicked: todo },
  null,
  { label: "Leave", clicked: todo, color: "var(--color-red)" },
  null,
  { label: "Copy ID", clicked: todo },
]} />
{/if}
<svelte:window on:click={() => context = null} />
<br />
<!--
<Context items={[
  { label: "Profile", clicked: todo },
  { label: "Message", clicked: todo },
  { label: "Block", clicked: todo },
  null,
  { label: "Kick [user]", clicked: todo, color: "var(--color-red)" },
  { label: "Ban [user]", clicked: todo, color: "var(--color-red)" },
  null,
  { label: "Copy ID", clicked: todo },
]} />
<br />
-->
<div class="popout">
  <a href="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY">
    <img src="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY" />
  </a>
  <h3>Display Name</h3>
  <div class="id">@username:example.com</div>
</div>
<br />
<div class="autocomplete">
  <h3>Commands matching <b>/</b></h3>
  <div class="option">foo</div>
  <div class="option">bar</div>
  <div class="option">baz</div>
</div>
<br />
