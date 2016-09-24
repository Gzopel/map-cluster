#!/usr/bin/env bash
. ./setup.sh

if [ "$#" -eq 0 ]; then
  CMD=bash
else
  CMD="$@"
fi

if [ "${INDEX:-1}" -gt "1" ]; then
  docker-compose scale app=${INDEX:-1}
fi
docker-compose exec --index=${INDEX-1} maps $CMD
