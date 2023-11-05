#!/bin/bash

# ANSI color codes
export BOLD='\033[1m'
export RESET='\033[0m' # No color or formatting
export RED='\033[0;31m'
export YELLOW='\033[0;33m'
export GREEN='\033[0;32m'
export BLUE='\033[0;34m'

# Enable the "exit on error" option, so that if any command fails the script will exit
set -e

function run_script() {
  local script="$1"
  local args=("${@:2}")
  chmod +x tools/scripts/"$script".sh
  ./tools/scripts/"$script".sh "${args[@]}"
}

function help() {
  awk -v BOLD="$BOLD" -v BLUE="$BLUE" -v YELLOW="$YELLOW" -v RESET="$RESET" \
  '{gsub(/{{BOLD}}/, BOLD); gsub(/{{BLUE}}/, BLUE); gsub(/{{YELLOW}}/, YELLOW); gsub(/{{RESET}}/, RESET); print}' \
  ./tools/scripts/help.txt
}

function setup_prod_env() {
  if [ -e .env.production ]; then
    echo -e "${YELLOW}WARNING${RESET} .env.production already exists"
  else
    echo "Setting environment variables in .env.production"
    echo "ENVIRONMENT=production" >> .env.production
    echo "DEBUG=true" >> .env.production
    # STUB: All the following values are placeholders
    echo "MONGODB_URI=mongodb://0.0.0.0:27017/galaxity" >> .env.production
    echo "SESSION_SECRET=1234567890" >> .env.production
    echo "SECRET_KEY=1234567890" >> .env.production
    echo "SECRET_IV=1234567890" >> .env.production
    echo "PUBLIC_CLIENT_ID=1234567890" >> .env.production
    echo "BOT_TOKEN=1234567890" >> .env.production
    echo "CLIENT_SECRET=1234567890" >> .env.production
    echo "DEV_GUILD_ID=1234567890" >> .env.production
    echo "DEV_ROLE_ID=1234567890" >> .env.production
    echo "ALERT_CHANNEL_ID=1234567890" >> .env.production
    echo "GUILD_CHANNEL_ID=1234567890" >> .env.production
    echo "USER_HISTORY_CHANNEL_ID=1234567890" >> .env.production
    echo "GUILD_HISTORY_CHANNEL_ID=1234567890" >> .env.production
    echo "CLIENT_CHANNEL_ID=1234567890" >> .env.production
    echo "VOTE_CHANNEL_ID=1234567890" >> .env.production
    echo "INFO_CHANNEL_ID=1234567890" >> .env.production
    echo "WARN_CHANNEL_ID=1234567890" >> .env.production
    echo "ERROR_CHANNEL_ID=1234567890" >> .env.production
    echo "DEBUG_CHANNEL_ID=1234567890" >> .env.production
  fi
}

function setup_dev_env() {
  if [ -e .env.local ]; then
    echo -e "${YELLOW}WARNING${RESET} .env.local already exists"
  else
    echo "Setting environment variables in .env.local"
    echo "ENVIRONMENT=development" >> .env.local
    echo "DEBUG=true" >> .env.local
    # STUB: All the following values are placeholders
    echo "MONGODB_URI=mongodb://0.0.0.0:27017/galaxity" >> .env.local
    echo "SESSION_SECRET=1234567890" >> .env.local
    echo "SECRET_KEY=1234567890" >> .env.local
    echo "SECRET_IV=1234567890" >> .env.local
    echo "PUBLIC_CLIENT_ID=1234567890" >> .env.local
    echo "BOT_TOKEN=1234567890" >> .env.local
    echo "CLIENT_SECRET=1234567890" >> .env.local
    echo "DEV_GUILD_ID=1234567890" >> .env.local
    echo "DEV_ROLE_ID=1234567890" >> .env.local
    echo "ALERT_CHANNEL_ID=1234567890" >> .env.local
    echo "GUILD_CHANNEL_ID=1234567890" >> .env.local
    echo "USER_HISTORY_CHANNEL_ID=1234567890" >> .env.local
    echo "GUILD_HISTORY_CHANNEL_ID=1234567890" >> .env.local
    echo "CLIENT_CHANNEL_ID=1234567890" >> .env.local
    echo "VOTE_CHANNEL_ID=1234567890" >> .env.local
    echo "INFO_CHANNEL_ID=1234567890" >> .env.local
    echo "WARN_CHANNEL_ID=1234567890" >> .env.local
    echo "ERROR_CHANNEL_ID=1234567890" >> .env.local
    echo "DEBUG_CHANNEL_ID=1234567890" >> .env.local
  fi
}

# Check if the environment argument is specified
if [ -z "$1" ]; then
  help
  exit 1
fi

args=("$@")

# Set the environment file based on the argument
if [ "$1" == "prod" ]; then
  if [ "$2" == "setup" ]; then
    if [ "$3" == "env" ]; then
      setup_prod_env
      exit 0
    fi
  fi
  git reset --hard
  git pull
  run_script check "${args[@]}"
  export COMPOSE_FILE="docker-compose.production.yml"
  run_script docker "${args[@]}"
elif [ "$1" == "dev" ]; then
  if [ "$2" == "setup" ]; then
    if [ "$3" == "env" ]; then
      setup_dev_env
      exit 0
    fi
  fi
  run_script check "${args[@]}"
  export COMPOSE_FILE="docker-compose.development.yml"
  run_script docker "${args[@]}"
elif [ "$1" == "ci" ]; then
  setup_prod_env
  run_script check "${args[@]}"
  export COMPOSE_FILE="docker-compose.ci.yml"
  run_script docker "${args[@]}"
elif [ "$1" == "check" ]; then
  run_script check "${args[@]}"
else
  help
  exit 1
fi
