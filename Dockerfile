FROM node
WORKDIR /srv/api
COPY . .
RUN yarn && yarn prestart
CMD yarn start
