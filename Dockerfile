FROM node:22-bullseye-slim

RUN export DEBIAN_FRONTEND=noninteractive; apt-get update && \
    apt-get install -y wkhtmltopdf inotify-tools && \
    apt-get clean

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY public ./public

EXPOSE 3033

ENTRYPOINT ["npm", "run", "dev"]
