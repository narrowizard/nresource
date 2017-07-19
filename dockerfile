FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
VOLUME ["/usr/src/app/content","/usr/src/app/webconfig.json"]
CMD ["/bin/sh","-c","node app.js"]
EXPOSE 8124