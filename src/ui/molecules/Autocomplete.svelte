<script>
import fuzzysort from "fuzzysort";
// export let type = "Commands";
export let type = "Members";
export let input;

// const options = [
//   { name: "shrug", description: "Prepends ¯\\_(ツ)_/¯ to your message" },
//   { name: "me", description: "Sends your text with emphasis" },
//   { name: "part", description: "Leave the room" },
//   { name: "join", description: "Join a room" },
//   { name: "invite", description: "Invite someone to the room" },
//   { name: "kick", description: "Kick someone from the room" },
//   { name: "ban", description: "Ban someone from the room" },
//   { name: "msg", description: "Message someone" },
//   { name: "plain", description: "Send a message without formatting" },
//   { name: "html", description: "Send a message as html" },
//   { name: "spoiler", description: "Send a message as a spoiler" },
//   { name: "nick", description: "Change your nickname for this room" },
// ];

const options = [
  { name: "tezlm", description: "@tezlm:celery.eu.org" },
];

$: filtered = input.slice(1).length ? fuzzysort.go(input.slice(1), options, { key: "name", limit: 20 }).map(i => i.obj) : options.slice(0, 20);
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

.option .icno {
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
</style>
<div class="autocomplete scroll">
  <div class="title">{type}</div>
  {#each filtered as option}
  <div class="option">
    <div class="icno">@</div>
    <div class="name">{option.name}</div>
    <div class="description">{option.description}</div>
  </div>
  {/each}
</div>
