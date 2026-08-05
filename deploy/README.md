# systemd deployment

## Install

```bash
git clone https://github.com/6static/corvus-meridian ~/corvus-meridian
cd ~/corvus-meridian
cp .env.sample .env   # fill in DISCORD_TOKEN and DISCORD_CLIENT_ID
sudo ./deploy/install.sh
```

For a different account or install path:

```bash
sudo ./deploy/install.sh --user bots --dir /home/bots/discord_bots/corvus-meridian
```

`sudo ./deploy/install.sh --help` for all options.

## Logs

```bash
journalctl -u corvus-meridian -f
```
