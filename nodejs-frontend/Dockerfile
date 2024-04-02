FROM node:18-alpine

#Copy Vue App
WORKDIR /src
COPY ./frontend/vuejs/dist/ /src/public/

#Server-Side-Rendering
COPY ./frontend/nodejs/package.json ./frontend/nodejs/package-lock.json /src/ 
RUN npm install --production

COPY ./frontend/nodejs/ /src/

CMD ["node", "server.js"]

EXPOSE 80

HEALTHCHECK CMD curl --fail http://localhost:80/health || exit 1