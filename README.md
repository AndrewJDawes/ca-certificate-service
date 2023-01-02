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
        #!/usr/bin/env bash
        # IMPORTANT - CHANGE THESE VARIABLES
        MY_CA_CERTIFICATE_DOWNLOAD_URL="https://my.certs.com/ca"
        MY_CA_CERTFICATE_FILENAME="Trusted_Root.crt"
        MY_CA_CERTIFICATE_NICKNAME="My Trusted Root"

        # Fetch the cert
        sudo curl -k -L "$MY_CA_CERTIFICATE_DOWNLOAD_URL" -o "/usr/local/share/ca-certificates/$MY_CA_CERTFICATE_FILENAME"

        # Update certificates
        sudo update-ca-certificates

        # Ensure certutil database exists
        if [ -d $HOME/.pki/nssdb ]; then
            :
            # Remove or change nssdb password if needed
            # certutil -d sql:$HOME/.pki/nssdb -W
        else
            mkdir -p $HOME/.pki/nssdb
            chmod 700 ~/.pki/nssdb
            certutil -d sql:$HOME/.pki/nssdb -N
        fi

        # Add cert
        certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "$MY_CA_CERTIFICATE_NICKNAME" -i  "/usr/local/share/ca-certificates/$MY_CA_CERTFICATE_FILENAME"

        # Confirm cert is added
        certutil -d sql:$HOME/.pki/nssdb -L | grep "$MY_CA_CERTIFICATE_NICKNAME"

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
