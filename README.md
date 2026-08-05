# Corva
A Discord leveling and economy bot: earn XP from chatting, level up, collect currency, spend it in the shop, and try your luck at coinflip or slots. Built by [6static](https://github.com/6static) as an open-source showcase.

## Features
- XP from message activity, with per-level curve and cooldown
- Leveling up posts an announcement and can auto-grant roles
- Currency: earn from leveling and `/daily`, spend in the shop
- Shop: server admins add role or consumable items via `/config add-shop-item`
- Games: `/coinflip` and `/slots`
- All configuration lives in slash commands

## Commands
| Command | Description |
|---|---|
| `/level [user]` | Show level and XP progress |
| `/leaderboard` | Top 10 members by XP in this server |
| `/balance [user]` | Show currency balance |
| `/daily` | Claim a daily currency reward |
| `/shop list` / `/shop buy <item>` | Browse and buy shop items |
| `/coinflip <bet> <choice>` | Bet currency on a coinflip |
| `/slots <bet>` | Bet currency on the slot machine |
| `/config ...` | Server admin: XP rate, currency name, daily amount, role rewards, shop items |

## Setup
```bash
npm install
cp .env.sample .env   # fill in DISCORD_TOKEN and DISCORD_CLIENT_ID
npm run register      # registers slash commands with Discord
npm run build
npm start
```

## Tech
TypeScript, discord.js, Sequelize + SQLite, Vitest.

## License
MIT