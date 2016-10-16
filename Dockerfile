FROM mhart/alpine-node:6.7.0

RUN adduser -S nodejs
USER nodejs

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package.json /home/nodejs/app/
RUN npm install --production
RUN npm dedupe
COPY . /home/nodejs/app

CMD ["npm", "start"]
