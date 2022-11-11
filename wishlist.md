# wishlist

each checkbox requires varying levels of difficulty. an ` ` means
(essentially) not started, `-` means there is a working basic
implementation, and `x` means it is done

- [ ] account management
  - [x] login/logout
  - [ ] register
  - [ ] guests
  - [ ] (future) replace with oidc
- [x] messages
  - [x] view messages
  - [x] send message
  - [x] edit message
  - [x] delete message
  - [x] reply to message
  - [x] emoji picker
  - [x] markdown
- [x] attachments
  - [x] send files
  - [x] paste in files
  - [x] open attachments in popup
  - [x] image/video dimensions
  - [ ] file too big warning
  - [x] drag and drop to upload file
- [x] reactions
- [x] members
  - [x] member popout
  - [x] members list
  - [x] lazy load full member list
- [ ] settings
  - [x] make them save
  - [ ] edit basic user info
  - [ ] appearance/theme settings
  - [x] edit basic room info
  - [x] edit permissions
  - [ ] join rules settings
- [ ] notifications
  - [ ] show # of unread messages(?)
  - [ ] mentions list/inbox
  - [x] highlight mentions
  - [ ] play sounds
  - [ ] desktop notifications
  - [ ] change favicon based on notifs
- [ ] rich input
  - [ ] markdown preview
  - [ ] slash commands
  - [ ] user/command autocomplete
  - [ ] room autocomplete?
- [ ] spaces
  - [-] space home
  - [-] add/remove rooms from spaces
  - [x] show correct order of rooms
  - [ ] order top level spaces
  - [x] display sub-spaces
- [ ] rooms
  - [x] create room
  - [x] leave room
  - [x] join room
  - [ ] knock room
  - [x] invite people
  - [ ] search room directory
- [x] moderation
  - [x] ban/kick/unban people
  - [x] change power levels
- [ ] timeline
  - [-] jump to reply
  - [ ] jump to unread
  - [ ] jump to latest
  - [ ] link embeds
  - [ ] room embeds
  - [-] show m.room.member change type + reason
  - [-] show other state events (m.*)
  - [ ] (future) use extensible events
- qol/misc
  - [x] user colors
  - [x] view members by memberships
  - [x] view homeserver stats
- [x] context menus
- [ ] search messages
  - [ ] filtering
  - [ ] sorting(?)
- [ ] dms
  - [x] show dms differently
  - [ ] dm-only list
  - [ ] start dms
- [x] router (change title/url)
- [ ] persist
  - [x] save state/accountdata
  - [ ] save e2ee keys
  - [x] resume after restart
  - [-] resume after disconnect
- [ ] e2ee (VERY DIFFICULT)
  - [ ] basic implementation
  - [ ] attachments
  - [ ] import/export keys
  - [ ] cross signing + ssss
  - [ ] verification
  - [ ] key backup
- [x] nitor

## extra stuff

after the base stuff is done, i might start looking at other features

- [ ] custom emoji/stickers
  - [x] view
  - [ ] upload/edit/delete packs
  - [ ] upload/edit/delete emoji
  - [ ] use packs globally
  - [ ] edit per-user pack
- [ ] subscribe to policy lists
- [ ] display for other room types
  - [ ] m.policy
  - [ ] long form
  - [ ] forum
  - [-] media
  - [~] documents (cancelled, no good way to implement this + dubious necessity)
- [ ] threads
  - [ ] start thread
  - [ ] view in sidebar
  - [ ] view in sub room
  - [ ] join and leave threads
- [ ] voip
  - [ ] 1:1 calls
  - [ ] voice channels/rooms
  - [ ] video (camera)
  - [ ] video (screen share)
- [ ] presence
  - [ ] set online/offline
  - [ ] custom presence
- [ ] (internal) move most stuff to discount
- [ ] index and search encrypted room events

## not planned

i mean, *maybe* they'll be implemented, but they're so low priority
assume they won't be

- [~] stories (simply doesn't make sense for this)
- [~] push notifications (this isn't a mobile app, sorry)
- [~] room favorite/low priority (spaces exist)
- [~] server administration (this is a chat app, not a server admin interface)
- [~] sso login (will be replaced with oidc)
- [~] reporting content (current reporting system sucks, if a better method is merged into spec (eg. report to room moderators) i **aboslutely** will implement it)
