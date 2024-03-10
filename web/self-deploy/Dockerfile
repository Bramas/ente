# build locally with
#
#     yarn install
#     NEXT_PUBLIC_ENTE_ENDPOINT=http:://localhost:3000 NEXT_PUBLIC_ENTE_ALBUMS_ENDPOINT=http:://localhost:3002 yarn build
#
# (replace localhost with your server domain, for the album it should be a different domain poiting to the same ip)
# then build the docker image (from the parent directory):
#
#    docker build . -f self-deploy/Dockerfile
#
#
# After you have created a user, add 2To of storage by running the following sql command:
#
#   SELECT id FROM user;
#
#   then run the following command to allow 2To of storage to the user 
#   (replacing THE_USER_ID with the id obtained in the previous query):
#
#   INSERT INTO storage_bonus (bonus_id, user_id, storage, type, valid_till) VALUES ("self-hosted-myself", THE_USER_ID, 1099511627776, "ADD_ON_SUPPORT", 4413567600000000)
#

FROM nginx:alpine-slim
COPY ./apps/photos/out /usr/share/nginx/html
COPY self-deploy/nginx.conf /etc/nginx/conf.d/default.conf