# build this image in the parent directory:
#
#    docker build --build-arg endpoint=YOUR_ENDPOINT --build-arg albums_endpoint=YOUR_ALBUM_ENDPOINT . -f self-deploy/Dockerfile
#
# or if you yarn build before
#
#    docker build . -f self-deploy/Dockerfile
#
# After you have created a user, add 2To of storage by running the following sql command:
#
#   SELECT id FROM user;
#
#   then run the following command to allow 2To of storage to the user (replacing THE_USER_ID with the id obtained in the previous query):
#
#   INSERT INTO storage_bonus (bonus_id, user_id, storage, type, valid_till) VALUES ("self-hosted-myself", THE_USER_ID, 1099511627776, "ADD_ON_SUPPORT", 4413567600000000)
#
# You can either build the pages in docker or do it locally.
# To build the pages locally, comment the first stage
#
#FROM node:21-bookworm-slim as builder
#WORKDIR /app

#RUN apt update && apt install -y git && rm -rf /var/lib/apt/lists/*

#COPY package.json yarn.lock ./
#RUN yarn install


#ARG endpoint=http:://localhost:3000
#ARG albums_endpoint=http:://localhost:3002

#ENV NEXT_PUBLIC_ENTE_ENDPOINT=$endpoint
#ENV NEXT_PUBLIC_ENTE_ALBUMS_ENDPOINT=$albums_endpoint
#RUN yarn build

FROM nginx:alpine-slim

#COPY --from=builder /app/out /usr/share/nginx/html
# if built locally: 
COPY ./apps/photos/out /usr/share/nginx/html
COPY self-deploy/nginx.conf /etc/nginx/conf.d/default.conf