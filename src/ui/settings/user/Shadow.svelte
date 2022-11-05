<script>
import Toggle from "../../atoms/Toggle.svelte";
let { settings } = state;
</script>
<style>
.header {
  margin-bottom: 1em;
}

h1 {
  background: linear-gradient(120deg, #8547c6, #ab5d8a);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
  font: 20px var(--font-display);
  font-weight: 500;  
}

.item {
  display: flex;
  padding: 12px 0;
}

.description {
  color: var(--fg-light);
  font-size: 14px;
}
</style>
<div class="header">
  <h1>Shadow Settings</h1>
</div>
{#each [
  { id: "shadowsettings", name: "shadow settings",  desc: "Shows these settings! This is for work in progress or development stuff." },
  { id: "shadowdev",      name: "dev mode",         desc: "Shows context menu options useful for matrix/discard development" },
  { id: "shadowmod",      name: "extra moderation", desc: "Enables extra options somewhat useful for moderation" },
  { id: "shadowtest",     name: "testbed",          desc: "the pit" },
  { id: "nitor",          name: "nitor",            desc: "Unleash more fun with nitor. Enable nitor to upgrade your emoji, personalize your profile, share bigger files, and so much more." },
] as option}
  <div class="item">
    <div>
      <h5 class="title">{option.name}</h5>
      <div class="description">{option.desc}</div>
    </div>
    <div style="flex: 1; display: flex; margin-left: 8px">
      <div style="flex: 1;"></div>
      <Toggle checked={$settings.get(option.id)} toggled={(val) => option.clicked ? option.clicked(val) : $settings.put(option.id, val)}/>
    </div>
  </div>
{/each}
