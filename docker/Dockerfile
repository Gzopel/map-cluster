FROM node:6-slim

RUN apt-get update && \
  apt-get install -y sudo

WORKDIR "/app"

ENV LANG C.UTF-8
ENV PATH ./node_modules/.bin:$PATH
ENV TERM xterm

#this shouldn't be here, its ok for now
ENV NODE_ENV dev
ENV SEED dev

ARG UID
ARG USER

RUN useradd -ms /bin/bash ${USER:-dockerUser} --uid ${UID:-1000}
RUN adduser ${USER:-dockerUser} sudo
RUN echo "${USER:-dockerUser} ALL=(ALL) NOPASSWD: ALL"  >> /etc/sudoers
RUN echo 'export PATH=$PATH:/app/node_modules/.bin/' > /root/.bashrc
USER ${USER:-dockerUser}


COPY entrypoint.sh /entrypoint.sh
CMD sudo sh /entrypoint.sh
