#!/bin/bash

# Print the command
command=$(echo "$0" | sed -e 's/\/.*\///g')

# Check if correct options are provided
if [ "$#" -ne 4 ] || [ "$1" != "--origin" ] || [ "$3" != "--port" ]; then
  echo "Usage: $command --origin <URL> --port <PORT>"
	exit 1
fi

# Assign arguments to variables

