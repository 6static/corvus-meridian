#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<'EOF'
Usage: sudo ./deploy/install.sh [-u|--user USER] [-d|--dir PATH]

Builds the bot and installs/enables it as a systemd service.

  -u, --user USER   Account to build and run the bot as.
                     Defaults to $SUDO_USER.
  -d, --dir PATH     Path to the bot checkout.
                     Defaults to ~USER/corvus-meridian.
  -h, --help         Show this help and exit.

Examples:
  sudo ./deploy/install.sh
  sudo ./deploy/install.sh --user bots --dir /srv/discord_bots/corvus-meridian
EOF
}

DEPLOY_USER="${SUDO_USER:-}"
BOT_DIR=""

while [ $# -gt 0 ]; do
    case "$1" in
        -u|--user)
            DEPLOY_USER="$2"
            shift 2
            ;;
        -d|--dir)
            BOT_DIR="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

if [ "$(id -u)" -ne 0 ]; then
    echo "Run this with sudo: sudo ./deploy/install.sh" >&2
    exit 1
fi

if [ -z "$DEPLOY_USER" ] || [ "$DEPLOY_USER" = "root" ]; then
    echo "Could not determine a non-root deploy user." >&2
    echo "Run via 'sudo ./deploy/install.sh' from your own login, or pass one explicitly:" >&2
    echo "  sudo ./deploy/install.sh --user <username>" >&2
    exit 1
fi

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
    echo "No such user: $DEPLOY_USER" >&2
    exit 1
fi

DEPLOY_HOME=$(getent passwd "$DEPLOY_USER" | cut -d: -f6)
BOT_DIR="${BOT_DIR:-$DEPLOY_HOME/corvus-meridian}"

if [ ! -d "$BOT_DIR" ]; then
    echo "$BOT_DIR not found." >&2
    echo "Clone it first: git clone https://github.com/6static/corvus-meridian $BOT_DIR" >&2
    exit 1
fi

if [ ! -f "$BOT_DIR/.env" ]; then
    echo "$BOT_DIR/.env not found." >&2
    echo "cp $BOT_DIR/.env.sample $BOT_DIR/.env and fill in DISCORD_TOKEN/DISCORD_CLIENT_ID first." >&2
    exit 1
fi

# Runs as the deploy user (not root) via a login shell so it picks up their
# Node install (e.g. nvm) and leaves node_modules/dist owned by them.
sudo -u "$DEPLOY_USER" -H bash -lc "cd '$BOT_DIR' && npm install && npm run build"

if [ ! -f "$BOT_DIR/dist/index.js" ]; then
    echo "Build finished but $BOT_DIR/dist/index.js still doesn't exist — check the build output above." >&2
    exit 1
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
sed -e "s|{{DEPLOY_USER}}|$DEPLOY_USER|g" -e "s|{{BOT_DIR}}|$BOT_DIR|g" \
    "$SCRIPT_DIR/corvus-meridian.service.template" > /etc/systemd/system/corvus-meridian.service

systemctl daemon-reload
systemctl enable --now corvus-meridian

echo "Installed and started corvus-meridian (user: $DEPLOY_USER, dir: $BOT_DIR)"
echo "Logs: journalctl -u corvus-meridian -f"
