FROM node:18.16.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm i -g @nestjs/cli
COPY . .
EXPOSE 5432
RUN npm run build
