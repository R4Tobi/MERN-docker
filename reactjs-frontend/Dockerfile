# frontend/Dockerfile
FROM node:21-bookworm AS prod

WORKDIR /app

COPY ./reactjs/package.json /app
COPY ./pm2/ecosystem.config.js /app

RUN npm install
RUN npm install pm2 -g

COPY ./reactjs/ /app/

EXPOSE 3000

ENTRYPOINT ["pm2", "start", "ecosystem.config.js"]