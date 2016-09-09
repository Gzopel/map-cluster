#!/usr/bin/env bash
export APP_NAME=game-cluster

docker build . -t $APP_NAME
docker-compose up  --remove-orphans -d
