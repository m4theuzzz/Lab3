FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN npm install &&\
    npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
