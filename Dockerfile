FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV MARIADBHOST "localhost"
ENV MARIADBUSER "adri"
ENV MARIADBPSW "aurelebg"
ENV MARIADBDATABASE "artlas"
ENV MONGODBURL "mongodb://localhost:27017/"

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD [ "npm", "start" ]