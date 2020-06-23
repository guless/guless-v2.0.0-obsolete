#!bin/bash

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout ./private/server.key \
    -new \
    -out ./private/server.crt \
    -config ./scripts/generate-self-signed-cert.conf \
    -sha256 \
    -days 3650