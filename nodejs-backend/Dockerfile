FROM node:21-alpine

WORKDIR /src
COPY ./backend/package.json /src/package.json
COPY ./backend/package-lock.json /src/package-lock.json
RUN npm install

COPY ./backend/server.mjs /src/server.mjs
COPY ./backend/packages /src/packages
COPY ./backend/docs /src/docs

EXPOSE 8080

USER root

CMD ["node", "server.mjs"]

HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1