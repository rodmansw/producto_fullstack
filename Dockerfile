FROM node:12.20.1-alpine3.10

COPY . /app
RUN apk add --no-cache git

WORKDIR /app
COPY package.json /app/package.json
ENV PORT 3000
EXPOSE 3000

RUN npm install

CMD ["npm", "start"]