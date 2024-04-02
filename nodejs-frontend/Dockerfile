FROM node:18-alpine

#Copy Vue App
WORKDIR /src
COPY ./frontent/vuejs/public ./public/

#Server-Side-Rendering
#COPY ./frontend/nodejs/package.json ./frontend/nodejs/package-lock.json /src/ 
RUN npm install --production

COPY ./frontend/nodejs/ /src

CMD ["node", "server.js"]

EXPOSE 80