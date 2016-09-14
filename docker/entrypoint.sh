#!/usr/bin/env bash

#Just making sure we are the owners
APP_UID=$(id -u)
FILE_OWNER_UID=$(stat -c '%u' /app/package.json)
USER=$(id -un)
if [ ! $APP_UID == $FILE_OWNER_UID ]; then
  echo "Changing ${USER}'s uid from $APP_UID to $FILE_OWNER_UID"
  sudo usermod -u $FILE_OWNER_UID $USER
fi

#keep container alive
while true; do sleep 1000; done
