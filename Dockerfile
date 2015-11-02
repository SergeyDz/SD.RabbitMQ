# Name: sergeyd/ubuntu-node-js

# DOCKER-VERSION 0.10.0

FROM ubuntu:15.10

# Install Node.js and npm
RUN 	apt-get update
RUN     apt-get -y install nodejs
RUN     apt-get -y install npm

# install PostgresSql

# Bundle app source
COPY . /
# Install app dependencies

RUN cd /src && npm install
EXPOSE  8087

CMD nodejs index.js 
