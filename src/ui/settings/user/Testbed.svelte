<script>
import Markdown from "../../molecules/Markdown.svelte";
import Embed from "../../molecules/Embed.svelte";
import Button from "../../atoms/Button.svelte";
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
</style>
<p>testbed for random stuff</p>
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
      <Button label="Join" type="good" clicked={todo} />
    </div>
  </div>
</div>
<div style="min-height: 1em"></div>
<Markdown bind:content={input} />
<div style="min-height: 1em"></div>
<Embed {embed} />
