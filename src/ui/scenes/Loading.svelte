<script>
import Loading from "../atoms/Loading.svelte";

const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const someFactsIThinkSomePeopleMightFindInteresting = [
  "\"State resolution\" is how federation conflicts are solved",
  "A group of mandrils is called a horde",
  "You left the oven on",
  "A space can theoretically contain itself",
  "How are you doing today?",
  "Just a little bit more time...",
  "boo! loading text jumpscare!",
  "Caching the future...",
  "Seasoning flavor text...",
  "Earth was established in 1924",
  "It's pronounced GIF",
  "What's the difference between crispy and crunchy?",
  "If you have no goal, you can't fail",
  "Drink some water!",
  "breathe",
  "The only app that's rewritten evey 5 days",
];
</script>
<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  background: var(--bg-spaces);
}

.title {
  margin-top: 1em;
}

i {
  color: var(--fg-muted);
}
</style>
<div class="wrapper">
  <Loading />
  <div class="title">syncing...</div>
  <i>{rnd(someFactsIThinkSomePeopleMightFindInteresting)}</i>
</div>
