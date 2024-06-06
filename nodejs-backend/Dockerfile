FROM node:21-alpine

WORKDIR /src
COPY ./nodejs/package.json /src/package.json
COPY ./nodejs/package-lock.json /src/package-lock.json
RUN npm install

COPY ./nodejs/server.mjs /src/server.mjs
COPY ./nodejs/packages /src/packages
COPY ./nodejs/docs /src/docs

EXPOSE 8080

USER root

CMD ["node", "server.mjs"]

HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1