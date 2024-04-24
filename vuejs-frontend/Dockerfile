FROM node:21-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY ./reactjs/package.json ./

FROM base as builder
WORKDIR /app
COPY ./reactjs/ .
RUN npm run build


FROM base as production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN npm update
RUN npm i pm2 -g

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "start", "server.js" ]