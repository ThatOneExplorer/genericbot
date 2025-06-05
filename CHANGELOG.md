# Changelog

All notable changes to this project will be documented in this file.
# [v1.3] - 05-06-25

## Added

- Added unban command

## Changed

- ignore messages by bots at the start of messageCreate event

- Fixed missing permission embed in ban to reflect missing ban permissions

- User not being in guild no longer stops ticket from being deleted.

- specified that times in train.js embed is in UTC for Translink

## Removed

- No new removals
# [v1.2.1] = 31-05-25
## Added

- No new additions

## Changed

- Updated help command and interactions to reflect new commands added

## Removals

- Nothing removed

# [v1.2.0] - 31-05-25

## Added

- Added !mc command, provides a status update on the minecraft server

- Minecraft server status updates are sent periodically to discord server to display status

## Changed

- Added MINECRAFT_HOST, MINECRAFT_STATUS, MINECRAFT_PLAYER_COUNT to .env representing channel ids

- Reflected .env additions in envexample.txt

- owner.send changed to owner.user.send in error handling across most commands and events

## Removed

- No new removals made

# [v.1.1.1] - 27-05-25

## Added 

- No new changes

## Changed

- Fixed bug in modlogs, line 36 would return an error if args[1] was a string

## Removed

- No new removals

## [v1.1.0] - 

## Added

- Added censor command to add, remove or view censor list from mongodb

- Added whitelist command to add, remove or view whitelist from mongodb

- Added new whitelistSchema to models/

- Added new censorSchema to models/

- Added envexample.txt to provide an example of .env layout

## Changed

- Moved from local json file to customisable mongodb for censor and whitelist functions

- moved THREAD_CATEGORY_ID, MEMBER_COUNT, READY_CHANNEl, ALERT_CHANNEL, GENERAL_CHAT, MEMBER_ROLE, SUGGESTIONS_CHANNEL, MUTE_ROLE to .env instead of being defined in commands

- Channel ID's are no longer hardcoded in individual command files

- Added installation instructions to README.md

- Set mongoose strictQuery to false in index.js

- changed how usernames of members are resolved in delete.js and modlogs.js

- Improved error handling in messageCreate.js for modmail section. 

- Allow attachments to be sent by staff and users in modmail

-  Improved event logging
## Removed
- Removed censor.json & whitelist.json
--

## [v1.0.1] - 27-05-25

### Added

- Fixed up **train.js** for better code readability and end-user experience

---

## [v1.0.0] - 2025-05-25

### Added
- Initial open source release of **genericbot-v13**.
- Built using Discord.js v14.
- Core features include:
  - Basic moderation commands (kick, ban, mute).
  - Command handler with prefix support.
  - Help command listing available commands.
  - Event handling
- Compliance with the Constitution of the Eternal and Sovereign Generic Nation.
- Licensed under the GNU General Public License v3.0 (GPLv3).

---
