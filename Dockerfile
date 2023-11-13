FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV MARIADBHOST "ahddry.fr:3306"
ENV MARIADBUSER "adri"
ENV MARIADBPSW "aurelebg"
ENV MARIADBDATABASE "bdd_test"
ENV MONGODBURL "mongodb://mongodb.ahddry.fr:27017/"

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD [ "npm", "start" ]