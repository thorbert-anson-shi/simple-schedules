FROM dhi.io/node:26-debian13-dev@sha256:f695c0e3e60477dee376315e3c7472a3de6f3d10fe9930adfa116119f5c47c39 AS base
RUN corepack enable && corepack prepare pnpm@11.7.0 --activate && chmod +x /usr/bin/pnpm
WORKDIR /app
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./


FROM base as prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=0,gid=0 \
  pnpm install --prod --frozen-lockfile


FROM base as builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=0,gid=0 \
  pnpm install --frozen-lockfile
RUN pnpm run build


FROM dhi.io/node:26-debian13@sha256:186303fde062c90576f5c81a2814369ac91689223304dee6a2f3e4f44dce24bb AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
USER node
CMD ["node", "/app/dist/src/main.js"]
