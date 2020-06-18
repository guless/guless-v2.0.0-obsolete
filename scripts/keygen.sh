#!bin/bash

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout ./scripts/server.key \
    -new \
    -out ./scripts/server.crt \
    -config ./scripts/keygen.conf \
    -sha256 \
    -days 3650