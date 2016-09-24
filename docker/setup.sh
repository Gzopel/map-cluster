#!/usr/bin/env bash
export APP_NAME=map-cluster

docker build -t $APP_NAME .

docker-compose up --remove-orphans -d
