# Start the server and the webapp

clone the project then add a compose.yaml file at the root of the project with the following content:

```yaml
services:
  museum:
    build:
      context: server
      args:
        GIT_COMMIT: local
    ports:
      - 8080:8080 # API
      - 2112:2112 # Prometheus metrics
    depends_on:
      postgres:
        condition: service_healthy
    
    # Wait for museum to ping pong before starting the webapp.
    healthcheck:
      test:
        [
          "CMD",
          "echo",
          "1"      # I don't know what to put here
        ]

    environment:

      # run  `go run tools/gen-random-keys/main.go` in the server directory to generate the keys
      #ENTE_KEY_ENCRYPTION:
      #ENTE_KEY_HASH:
      #ENTE_JWT_SECRET:
    
      # can also be set from the host environment. example: VAR: ${VAR}
      ENTE_S3_B2-EU-CEN_KEY: YOUR_S3_KEY
      ENTE_S3_B2-EU-CEN_SECRET: YOUR_S3_SECRET
      ENTE_S3_B2-EU-CEN_ENDPOINT: YOUR_S3_ENDPOINT
      ENTE_S3_B2-EU-CEN_REGION: YOUR_S3_REGION
      ENTE_S3_B2-EU-CEN_BUCKET: YOUR_S3_BUCKET
      ENTE_S3_ARE_LOCAL_BUCKETS: false
      
      ENTE_INTERNAL_HARDCODED-OTT_LOCAL-DOMAIN-SUFFIX: "@example.com"
      ENTE_INTERNAL_HARDCODED-OTT_LOCAL-DOMAIN-VALUE: 123456
      
      # no need to touch these
      ENTE_DB_HOST: postgres
      ENTE_DB_PORT: 5432
      ENTE_DB_NAME: ente_db
      ENTE_DB_USER: pguser
      ENTE_DB_PASSWORD: pgpass
      
    volumes:
      - custom-logs:/var/logs
    networks:
      - internal

  web:
    build:
      context: web
      args:
        ENDPOINT: "http://localhost:8080"
        ALBUMS_ENDPOINT: "http://localhost:8082"
        GIT_SHA: local
    ports:
      - 8081:80
      - 8082:80
    depends_on:
      museum:
        condition: service_healthy

  postgres:
    image: postgres:12
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: pguser
      POSTGRES_PASSWORD: pgpass
      POSTGRES_DB: ente_db
    # Wait for postgres to be accept connections before starting museum.
    healthcheck:
      test:
        [
          "CMD",
          "pg_isready",
          "-q",
          "-d",
          "ente_db",
          "-U",
          "pguser"
        ]
      interval: 1s
      timeout: 5s
      retries: 20
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - internal

volumes:
  custom-logs:
  postgres-data:

networks:
  internal:
```

Then run the following command to start the server and the webapp:

```bash
docker compose up -d
```

    
# Add 2To of storage limite to the first user

```bash 
    docker compose exec -i postgres psql -U pguser -d ente_db -c "INSERT INTO storage_bonus (bonus_id, user_id, storage, type, valid_till) VALUES ('self-hosted-myself', (SELECT user_id FROM users), 2199023255552, 'ADD_ON_SUPPORT', 0)"
```