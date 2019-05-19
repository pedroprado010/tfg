FROM node:10.15.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# COPY ./package.json /usr/src/app/
# RUN npm install
# COPY . /usr/src/app/
EXPOSE 3000
CMD ["npm", "install", "pm2", "-g"]
CMD ["npm", "install"]
CMD ["pm2", "start", "./core/index.js"]
