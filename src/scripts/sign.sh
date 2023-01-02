#!/usr/bin/env bash

# Grab the domain and working folder
domain="$1"
output_path="$2"

# Ensure domain folder exists on filesystem
mkdir -p "$output_path"

# Create a config file for domain
cat >"$output_path/openssl.cnf" <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $domain
EOF

# Sign the certificate
openssl x509 \
    -req \
    -passin  file:"/app/data/secrets/CA" \
    -in "$output_path/child.csr" \
    -CA "/app/data/ca/CA.pem" \
    -CAkey "/app/data/ca/CA.key" \
    -CAcreateserial \
    -out "$output_path/fullchain.pem" \
    -days 825 \
    -sha256 \
    -extfile "$output_path/openssl.cnf"

# Write the certificate to stdout
cat $output_path/fullchain.pem
