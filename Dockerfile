FROM node:6-slim

WORKDIR "/app"
COPY .setup.sh /.setup.sh
CMD /.setup.sh
