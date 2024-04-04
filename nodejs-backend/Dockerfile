FROM node:18-alpine

WORKDIR /src
COPY ./backend/package.json /src/package.json
COPY ./backend/package-lock.json /src/package-lock.json
RUN npm install

COPY ./backend/server.js /src/server.js

EXPOSE 8080

CMD ["node", "server.js"]

HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1