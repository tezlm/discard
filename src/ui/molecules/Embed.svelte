<script>
import { parseMxc } from "../../util/content.ts";
export let url;
export let embed;

/*
discord does special casing for
- youtube
- xkcd (i think?)
- soundcloud
- twitter
- 
*/

// TODO: rework this to make embeds suck less

// should the image be full size (under body) or an icon (float right)
$: thumbnailImg = embed["og:image"] && (embed["og:type"] === "profile" || embed["og:image:width"] < 72);

// should this be a full embed or only show the attachment (image)
$: rawImg = embed["og:image"] && (embed["og:title"] === embed["og:url"] || embed["og:type"] === "video.other");
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
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.embed img.main {
  width: 100%;
  max-height: 250px;
}

.embed img.thumb {
  float: right;
  max-width: 72px;
  min-width: 36px;
  margin-left: 8px;
  margin-bottom: 8px;
}

.raw {
  max-height: 300px;
  max-width: 400px;
  width: min-content;
  object-fit: contain;
  object-position: left;
}

.raw img {
  height: 100%;
  border-radius: 3px;
  cursor: pointer;
}
</style>
{#if rawImg}
<div class="raw">
  <img src={parseMxc(embed["og:image"])} on:click={() => state.popup.set({ id: "attachment", url: parseMxc(embed["og:image"]) })}/>
</div>
{:else}
<div class="embed">
  {#if thumbnailImg}
    <img class="thumb" src={parseMxc(embed["og:image"])} on:click={() => state.popup.set({ id: "attachment", url: parseMxc(embed["og:image"]) })}/>
  {/if}
  {#if embed["og:site_name"]}
    <a class="sitename" href={new URL(url).origin}>{embed["og:site_name"]}</a>
  {/if}
    <h4><a href={url}>{embed["og:title"]}</a></h4>
  {#if embed["og:description"]}
    <div class="description">{embed["og:description"]}</div>
  {/if}
  {#if embed["og:image"] && !thumbnailImg}
    <img class="main" src={parseMxc(embed["og:image"])} on:click={() => state.popup.set({ id: "attachment", url: parseMxc(embed["og:image"]) })}/>
  {/if}
</div>
{/if}
