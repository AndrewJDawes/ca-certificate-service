# ca-certificate-service

Express static server

## Set up

-   Add CA certs to `/data/ca/`
    -   Recommended to bind mount a volume to `/data/ca/`
    -   Cert file names
        -   `CA.key`
        -   `CA.pem`
-   If you need to generate CA certs
    -   `openssl genrsa -des3 -out CA.key 2048`
    -   `openssl req -x509 -new -nodes -key CA.key -sha256 -days 1825 -out CA.pem`
-   Add your CA.key passphrase to a file `/data/secrets/CA`
    -   Recommended to bind mount a volume to `/data/secrets/`

## Install root certificate on devices

-   Reference
    -   https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/#installing-root-cert
-   Examples

    -   Linux

        -   Ubuntu

            -   Reference
                -   https://serverfault.com/questions/414578/certutil-function-failed-security-library-bad-database
                -   https://www.richud.com/wiki/Ubuntu_chrome_browser_import_self_signed_certificate
                -   https://web.archive.org/web/20121020174226/http://blog.avirtualhome.com/adding-ssl-certificates-to-google-chrome-linux-ubuntu/
                -   https://superuser.com/questions/104146/add-permanent-ssl-certificate-exception-in-chrome-linux
            -   Script

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

    -   macOS
        -   `sudo curl -k -L localhost/ca -o ~/Downloads/My_Trusted_Root.crt && sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" ~/Downloads/My_Trusted_Root.crt`
    -   iPhone
        -   https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/#installing-root-cert
    -   Android
        -   Will need to SSH into phone first
            -   https://gist.github.com/raveenb/ab3217798c827be889b83b584d70b08b
        -   Should be similar after to Ubuntu instructions above
    -   cURL
        -   cURL uses its own bundle of CA certificates and ignores the place where we install trusted certificates on the host
        -   We can override this by pointing curl to use our trusted certs location using `--cacert` option
        -   Linux
            -   `curl --cacert /etc/ssl/certs/ca-certificates.crt https://my.site.com`
        -   Test the connection
            -   </dev/null openssl s_client -connect my.site.com.com:443 -showcerts 2>/dev/null
