FROM node:4.8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY index.js ./
# Copying local.in to /etc/couchdb/local.ini


RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
EXPOSE 3000
#COPY /couchdb/local.ini /etc/couchdb/local.ini
CMD [ "npm", "start" ]
