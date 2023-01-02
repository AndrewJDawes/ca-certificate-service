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

## Install root certificate on devices

- Reference
  - https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/#installing-root-cert
- Examples
  - Linux
    - Ubuntu
        ```
        # Install tools if needed
        sudo apt-get install libnss3-tools
        sudo apt-get install curl

        # Download CA cert
        sudo curl -k -L localhost/ca -o /usr/local/share/ca-certificates/My_Trusted_Root.crt && sudo update-ca-certificates

        # Remove or change nssdb password if needed
        certutil -W -d sql:$HOME/.pki/nssdb

        # Add cert
        certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "My_Trusted_Root" -i  /usr/local/share/ca-certificates/My_Trusted_Root.crt

        # Confirm cert is added
        certutil -d sql:$HOME/.pki/nssdb -L | grep "My_Trusted_Root"
        ```
  - macOS
    - `sudo curl -k -L localhost/ca -o ~/Downloads/My_Trusted_Root.crt && sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" ~/Downloads/My_Trusted_Root.crt`
  - iPhone
    - https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/#installing-root-cert
  - cURL
    - cURL uses its own bundle of CA certificates and ignores the place where we install trusted certificates on the host
    - We can override this by pointing curl to use our trusted certs location using `--cacert` option
    - Linux
      - `curl --cacert /etc/ssl/certs/ca-certificates.crt https://my.site.com`
    - Test the connection
      - </dev/null openssl s_client -connect my.site.com.com:443 -showcerts 2>/dev/null
