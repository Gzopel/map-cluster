FROM node:6-slim


USER root

ENV TERM xterm


WORKDIR "/app"

ADD entrypoint.sh /entrypoint.sh
RUN chown root:root /entrypoint.sh
RUN chmod +x /entrypoint.sh
# ENTRYPOINT ["/entrypoint.sh"]

CMD /entrypoint.sh
