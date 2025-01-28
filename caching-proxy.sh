#!/bin/bash

# Print the command
command=$(echo "$0" | sed -e 's/\/.*\///g')

# Check if correct options are provided
if [ "$#" -ne 4 ] || [ "$1" != "--port" ] || [ "$3" != "--origin" ]; then
  echo "Usage: $command --port <number> --origin <url>"
	exit 1
fi

# Assign arguments to variables
URL=$2
PORT=$4

cd ./caching-proxy

node server.js "$URL" "$PORT"
