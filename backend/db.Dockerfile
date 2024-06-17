FROM postgres:16.2-alpine

COPY ./db-init.sql /docker-entrypoint-initdb.d/

RUN chown postgres:postgres /docker-entrypoint-initdb.d/db-init.sql
