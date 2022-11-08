<script>
import { onDestroy } from "svelte";
import Scroller from '../../molecules/Scroller.svelte';
import Upload from '../timeline/Upload.svelte';
import Placeholder from '../timeline/Placeholder.svelte';
import Create from "../events/Create.svelte";
import MessageReply from "../message/MessageReply.svelte";
import MessageContent from "../message/MessageContent.svelte";
import MessageEdit from "../message/MessageEdit.svelte";
import RoomInput from "../RoomInput.svelte";
import { formatDate } from "../../../util/format.ts";
import Avatar from "../../atoms/Avatar.svelte";
import Name from "../../atoms/Name.svelte";
import { memberContext } from "../../../util/context";
export let room;
export let slice;
let { focused, reply, edit, upload, input } = state.roomState;
let { pushRules, popout, context } = state;
let scrollTop, scrollMax, scrollTo, reset;
let textareaEl;

$: if (slice) refocus();

function getReply(content) {
  return content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
}

async function fetchBackwards() {
	const success = await actions.slice.backwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

async function fetchForwards() {
	const success = await actions.slice.forwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

function refocus() {
	if (scrollTo && scrollTop > scrollMax - 16) {
		queueMicrotask(() => scrollTo(-1));
	}
}

let resizeTimeout;
function handleResize() {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(refocus, 50);
}

function getHighlight(event, reply) {
	if (reply?.id === event.id) return "var(--color-blue)";
}

function shouldPing(event) {
	const parsed = $pushRules.parse(event);
	let highlight = false;
	parsed.reverse();
	for (let { actions } of parsed) {
		const hl = actions.find(a => a.set_tweak === "highlight");
		if (!hl) continue;
		if (hl.value === false) {
			highlight = false;
		} else {
			highlight = true;
		}
	}
	return highlight;
}

const showMemberPopout = (event) => (e) => { 
  const rect = e.target.getBoundingClientRect();
  const _owner = `${event.id}-${event.sender.id}`;
  if ($popout._owner === _owner) return $popout = {};
  $popout = {
    id: "member",
    member: event.sender,
    animate: "right",
    top: rect.y,
    left: rect.x + rect.width + 8,
    _owner,
  };
}

const showMemberContext = (member) => (e) => {
  $context = {
    items: memberContext(member),
    x: e.clientX,
    y: e.clientY
  };
}

onDestroy(state.focusedRoom.subscribe(() => {
	console.time("focus room")
	queueMicrotask(() => console.timeEnd("focus room"));
}));

onDestroy(state.focusedRoom.subscribe(() => queueMicrotask(() => reset && reset())));
onDestroy(upload.subscribe(refocus));
onDestroy(reply.subscribe(refocus));
onDestroy(edit.subscribe(refocus));
$: if ($focused) {
	const id = $focused;
	const element = document.querySelector(`[data-event-id="${id}"]`);
	if (element) {
		queueMicrotask(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
		setTimeout(() => id === $focused && focused.set(null), 2000);
	}
}

$: if ($edit) {
	const element = document.querySelector(`[data-event-id="${$edit}"]`);
	if (element) {
		setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
	}
}

$: if (room) textareaEl?.focus();
$: if ($reply || true) textareaEl?.focus();
$: if (!$edit) textareaEl?.focus();

async function sendMessage(content) {
  if ($reply) {
    content["m.relates_to"] = {};
    content["m.relates_to"]["m.in_reply_to"] = {};
    content["m.relates_to"]["m.in_reply_to"]["event_id"] = $reply.id;
    reply.set(null);
  }

  const id = `~${Math.random().toString(36).slice(2)}`;
  room.accountData.set("m.fully_read", id);
  room.sendEvent("m.room.message", content, id);
  state.log.debug("send event to " + room.id);
}

function getRoomName(room) {
	if (room.name) return room.name;
	const other = state.dms.get(room.id);
	return other?.name ?? other?.id;
}
</script>
<style>
.content {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: end;
	overflow: hidden;
}

.spacer {
	margin: 10px 0;
}

.tall {
	display: flex;
	min-height: 1200px;
	overflow: hidden;
}

.highlight {
	position: relative;
}

.highlight::before, .highlight::after {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	background: var(--color);
}

.highlight::after {
	width: 2px;
}

.highlight::before {
	width: 100%;
	opacity: .2;
}

.ping {
	position: relative;
}

.editing {
	position: relative;
  background: rgba(4,4,5,0.07);
}

.focused {
	position: relative;
}

.ping::before, .ping::after {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	background: var(--event-ping);
}

.ping::before {
	width: 100%;
	opacity: .1;
}

.ping::after {
	width: 2px;
}

.focused {
	background: var(--event-focus-bg);
	animation: unfocus 1s 1s forwards;
}

@keyframes unfocus {
	100% { background: none }
}

.message {
  display: flex;
  flex-direction: column;
	margin: 14px 16px;
  padding: 8px;
	background: var(--bg-rooms-members);
	border-radius: 8px;
}

.header {
  display: flex;
  flex-direction: row;
}

.author {
  height: 22px;
  line-height: 22px;
}

.avatar {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  box-shadow: 0 0 0 #00000022;
  cursor: pointer;
  transition: box-shadow .2s;
}

.avatar:active {
  transform: translateY(1px);
}

.avatar:hover, .avatar.selected {
  box-shadow: 0 4px 4px #00000022;
}

.badge {
  display: inline-block;
  position: relative;
  padding: 0 4px;
  bottom: 2px;

  color: var(--fg-notice);
  background: var(--color-accent);
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 3px;
}

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  user-select: text;
}

.message-content {
	margin-top: 8px;
  color: var(--fg-content);
  flex: 1;
  max-width: 100%;
	white-space: pre-wrap;
}
</style>
<div class="content">
	<Scroller
		items={slice.events}
		itemKey="id"
		direction="up"
		bind:scrollTop={scrollTop}
		bind:scrollMax={scrollMax}
		bind:scrollTo={scrollTo}
		bind:reset={reset}
		let:data={event}
		{fetchBackwards}
		{fetchForwards}
		getDefault={() => [slice.events[0]?.type === "m.room.create", slice.atEnd()]}
	>
		<div slot="top" style="margin-top: auto"></div>
		<div slot="placeholder-start" class="tall" style="align-items: end"><Placeholder /></div>
		<div>
			{#if event.type === "m.room.message"}
				<div
					class="message"
					class:ping={shouldPing(event)}
					class:focused={$focused === event.id}
					class:editing={$edit === event.id}
					data-event-id={event.id}
					class:highlight={getHighlight(event, $reply)}
					style:--color={getHighlight(event, $reply)}
				  on:contextmenu={e => { const memberId = e.target.dataset.mxPing; if (memberId && room.members.has(memberId)) { e.preventDefault(); e.stopPropagation(); showMemberContext(room.members.get(memberId)) }}}
				>
				  <div class="header">
				    {#if getReply(event.content)}<MessageReply {room} eventId={getReply(event.content)} />{/if}
				    <div
				      class="avatar"
				      class:selected={$popout._owner === `${event.id}-${event.sender.id}`}
				      on:click|stopPropagation={showMemberPopout(event)}
				      on:contextmenu|preventDefault|stopPropagation={showMemberContext(event.sender)}
				    >
				      <Avatar user={event.sender} size={40} />
				    </div>
					  <div style="display: flex; flex-direction: column; margin-left: 8px;">
				      <div class="author">
				        <Name member={event.sender} />
					      {#if event.content.msgtype === "m.notice"}
					      <div class="badge">bot</div>
					      {/if}
				      </div>
				      <time datetime={event.date.toISOString()} style="display: inline">{formatDate(event.date)}</time>
					  </div>
				  </div>
				  <div class="message-content">
				    {#if event.id === $edit}
				    <MessageEdit {event} />
				    {:else}
				    <MessageContent {event} />
				    {/if}
				  </div>
				</div>
			{:else if event.type === "m.room.create"}
				<Create {room} {event} />
			{/if}
		</div>
		<div slot="placeholder-end" class="tall"><Placeholder /></div>
		<div slot="bottom" class="spacer">
		{#if $upload}<Upload upload={$upload} />{/if}
		<div style="padding: 0 16px; padding-bottom: 14px;">
			<RoomInput
				asdfasdfasdf
		    showUpload
		    placeholder={`Message ${getRoomName(room)}`}
		    onsend={sendMessage}
		    bind:input={$input}
		    bind:reply={$reply}
		    bind:textarea={textareaEl}
			/>
		</div>
		</div>
	</Scroller>
</div>
<svelte:window on:resize={handleResize} />
