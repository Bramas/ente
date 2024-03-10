# Server:

### Environment variables for postgresql

ENTE_DB_HOST=...
ENTE_DB_PORT=...
ENTE_DB_NAME=...
ENTE_DB_USER=...
ENTE_DB_PASSWORD=...

### Env for the secrets obtained with `go run tools/gen-random-keys/main.go`
ENTE_KEY_ENCRYPTION=
ENTE_KEY_HASH=
ENTE_JWT_SECRET=

### Environment variables for the S3 bucket
ENTE_S3_B2-EU-CEN_KEY=...
ENTE_S3_B2-EU-CEN_SECRET=...
ENTE_S3_B2-EU-CEN_ENDPOINT=
ENTE_S3_B2-EU-CEN_REGION=
ENTE_S3_B2-EU-CEN_BUCKET=
ENTE_S3_ARE_LOCAL_BUCKETS=false

### Environment variables to avoid OTT
ENTE_INTERNAL_HARDCODED-OTT_LOCAL-DOMAIN-SUFFIX=@you-domain.com
ENTE_INTERNAL_HARDCODED-OTT_LOCAL-DOMAIN-VALUE=123456


# Web app

build locally with

    yarn install
    NEXT_PUBLIC_ENTE_ENDPOINT=http:://localhost:3000 NEXT_PUBLIC_ENTE_ALBUMS_ENDPOINT=http:://localhost:3002 yarn build

(replace localhost with your server domain, for the album it should be a different domain poiting to the same ip)
then build the docker image (from the parent directory):

    docker build . -f self-deploy/Dockerfile

After you have created a user, add 2To of storage by running the following sql command:

    SELECT id FROM user;

Then run the following command to allow 2To of storage to the user 
  (replacing THE_USER_ID with the id obtained in the previous query):

    INSERT INTO storage_bonus (bonus_id, user_id, storage, type, valid_till) VALUES ("self-hosted-myself", THE_USER_ID, 1099511627776, "ADD_ON_SUPPORT", 4413567600000000)
