<style>
.nav {
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	width: 240px;
}

.room {
	margin: 4px 8px;
	padding: 4px 8px;
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
}

.room:hover {
	background: rgba(79,84,92,0.4);
}

.room.selected {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}
</style>
<div class="nav">
  <div class="room selected">foo</div>
  <div class="room">bar</div>
  <div class="room">baz</div>
</div>
