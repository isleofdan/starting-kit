# An app made from the starting kit. No build step; the image is the source
# tree plus Node. (The three apps add python3, make and g++ here only once
# they use better-sqlite3; see docs/NEW-APP.md.)
FROM node:22-slim

WORKDIR /app

COPY . .

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
