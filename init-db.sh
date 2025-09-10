#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE mocktail_auth;
    CREATE DATABASE mocktail_backend;
EOSQL
