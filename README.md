# ca-certificate-service
Express static server

## Set up
- Add CA certs to `data/ca/`
- Names
    - `CA.key`
    - `CA.pem`
- If you need to generate them
    - `openssl genrsa -des3 -out CA.key 2048`
    - `openssl req -x509 -new -nodes -key CA.key -sha256 -days 1825 -out CA.pem`
- Add your CA.key passphrase to a file `data/secrets/CA`
