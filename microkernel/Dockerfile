FROM node:10.15.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY . /usr/src/app/
EXPOSE 3000
CMD ["npm", "install", "pm2", "-g"]
CMD ["npm", "install"]
CMD ["pm2", "start", "/usr/src/app/core/index.js"]
