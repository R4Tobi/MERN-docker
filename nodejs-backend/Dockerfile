FROM node:18-alpine

WORKDIR /src
COPY ./backend/package.json ./backend/package-lock.json /src/ 
RUN npm install --production

COPY ./backend/ /src/

EXPOSE 8080

CMD ["node", "server.js"]