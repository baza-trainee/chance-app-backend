FROM node:18

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

RUN mkdir -p /home/node/logs && chown -R node:node /home/node/logs

USER node

WORKDIR  /home/node/app

COPY --chown=node:node ./server/package* ./

RUN npm ci --omit dev

RUN npm install @nestjs/cli

COPY --chown=node:node ./.env ./

COPY --chown=node:node ./server/tsconfig.* ./

COPY --chown=node:node ./server/src ./src

RUN npm run build

