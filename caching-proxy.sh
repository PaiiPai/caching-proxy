#!/bin/bash

# Print the command
command=$(echo "$0" | sed -e 's/\/.*\///g')

# Clear cache if --clear-cache option is provided
if [ "$#" -eq 1 ] && [ "$1" == "--clear-cache" ]; then
  node ./caching-proxy/server.js clear-cache
  exit 0
fi

# Check if correct options are provided
if [ "$#" -ne 4 ] || [ "$1" != "--port" ] || [ "$3" != "--origin" ]; then
  echo "Usage: $command --port <number> --origin <url>"
	exit 1
fi

# Assign arguments to variables
URL=$2
PORT=$4

node ./caching-proxy/server.js "$URL" "$PORT"
