<script type="ts">
import type { Room } from "discount.ts";
export let room: Room | null = null;
export let users: Array<string>;
$: [single, plural, typing] = getType(room?.name);

function getType(name: string = ""): [string, string, string?] {
  // const n = name.toLowerCase();
  // if (n.includes("files")) return ["other", "others", "uploading"];
  // if (n.includes("meme")) return ["memer", "memers"];
  // if (n.includes("bots")) return ["bot user", "bot users", "botting"];
  // if (n.includes("quotes")) return ["quoter", "quoters", "quoting"];
  // if (n.includes("music")) return ["musician", "musicians", "composing"];
  // if (n.includes("programm")) return ["programmer", "programmers"];
  // if (n.includes("spam")) return ["spammer", "spammers", "preparing to spam"];
  // if (n.includes("lounge")) return ["lounger", "loungers"];
  return ["other", "others"];
}
</script>
<style>
.typing {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.typing > .dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin-right: 2px;
  background: var(--fg-notice);
  animation: typing 1s infinite;
}

@keyframes typing {
  0% { transform: scale(1); opacity: .5 }
  40% { transform: scale(1.2); opacity: 1 }
  80% { transform: scale(1); opacity: .5 }
  100% { transform: scale(1); opacity: .5 }
}

.users {
  margin-left: 8px;
  padding-bottom: 4px;
}
</style>
<div class="typing">
  <div class="dot"></div>
  <div class="dot" style="animation-delay: 0.2s"></div>
  <div class="dot" style="animation-delay: 0.4s"></div>
  <div class="users">
    {#if users.length === 1}
      <b>{users[0]}</b>
    {:else if users.length === 2}
      <b>{users[0]}</b> and <b>{users[1]}</b>
    {:else if users.length === 3}
      <b>{users[0]}</b>, <b>{users[1]}</b>, and <b>{users[2]}</b> 
    {:else if users.length === 4}
      <b>{users[0]}</b>, <b>{users[1]}</b>, <b>{users[2]}</b>, and <b>{users[3]}</b> 
    {:else}
      <b>{users[0]}</b>, <b>{users[1]}</b>, <b>{users[2]}</b>, <b>{users[3]}</b>, and {users.length - 4} {#if users.length === 5}{single}{:else}{plural}{/if}
    {/if}
    {#if users.length === 1}is{:else}are{/if} {typing || "typing"}...
  </div>
</div>
