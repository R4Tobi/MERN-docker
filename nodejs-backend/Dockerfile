FROM node:22-alpine

WORKDIR /src
COPY ./nodejs/package.json /src/package.json
COPY ./nodejs/package-lock.json /src/package-lock.json
RUN npm install

COPY ./nodejs/server.js /src/server.js
COPY ./nodejs/.env /src/.env
COPY ./nodejs/packages /src/packages
COPY ./nodejs/docs /src/docs

EXPOSE 8080

USER root

CMD ["node", "server.js"]

HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1