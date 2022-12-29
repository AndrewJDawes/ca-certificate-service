# express-static-server
Express static server

## Set up
- Add CA certs to `data/certs/ca`
- Names
    - `CA.key`
    - `CA.pem`
- If you need to generate them
    - `openssl genrsa -des3 -out CA.key 2048`
    - `openssl req -x509 -new -nodes -key CA.key -sha256 -days 1825 -out CA.pem`
- Add CA.key passphrase to `data/secrets/ca_key_passphrase`
