<script>
import Markdown from "../../molecules/Markdown.svelte";
import Embed from "../../molecules/Embed.svelte";
import Button from "../../atoms/Button.svelte";
import Checkbox from "../../atoms/Checkbox.svelte";
export let tab;
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

function thing(node) {
  const handleClick = () => {
    alert("asdf");
  };
  
  node.addEventListener("click", handleClick);
  
  return {
    destroy() {
      node.removeEventListener("click", handleClick);
    }
  }
}
</script>
<style>
.join {
  display: inline-flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 4px;
  background: var(--bg-rooms-members);
}

.join img {
  border-radius: 50%;
  height: 48px;
  width: 48px;
}

.threeway {
  display: inline-flex;
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-rooms-members);
  border-radius: 4px;
  overflow: hidden;
}

.threeway .icon {
  padding: 4px;
  font-size: 18px;
  height: 26px;
  width: 32px;
}

.threeway .icon:hover {
  background: var(--mod-lighten);
}
</style>
<p>testbed for random stuff</p>
<div style="min-height: 1em"></div>
<div>
  <div class="threeway">
    <button class="icon" style="color: var(--color-red)">close</button>
    <button class="icon" style="color: var(--fg-interactive)">remove</button>
    <button class="icon" style="color: var(--color-green)">check</button>
  </div>
</div>
<div style="min-height: 1em"></div>
<div>
  tab: {tab}
  <a style="cursor: pointer" on:click|preventDefault={() => actions.to("/user-settings/test/foo")}>foo</a>
  <a style="cursor: pointer" on:click|preventDefault={() => actions.to("/user-settings/test/bar")}>bar</a>
  <a style="cursor: pointer" on:click|preventDefault={() => actions.to("/user-settings/test/baz")}>baz</a>
</div>
<div>
  <Checkbox />
</div>
<div style="min-height: 1em"></div>
<div use:thing>hello world</div>
<div style="min-height: 1em"></div>
<div>
  <div class="join">
    <div class="title">Your been invite to</div>
    <div style="display: flex; align-items: center">
      <img src={"https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"} />
      <div style="padding: 0 16px">
        <b>Room name</b>
        <p>details here - maybe the room topic, or the member count?</p>
      </div>
      <Button label="Join" type="good" on:click={todo} />
    </div>
  </div>
</div>
<div style="min-height: 1em"></div>
<Markdown bind:content={input} />
<div style="min-height: 1em"></div>
<Embed {embed} />
