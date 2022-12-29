"use strict";

const express = require("express");
const multer = require('multer');
const fs = require('fs');
const upload = multer();

// Constants
const PORT = 80;
const HOST = "0.0.0.0";

// App
const app = express();

// - /
// - Hello world
app.get('/', (req, res) => {
  res.send('Hello world');
});
// - /ca
// - Returns CA.pem

app.get('/ca', (req, res) => {
  fs.readFile('/usr/src/app/certs/ca/CA.pem', 'ascii', (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      res.send('Sorry, try again later')
      return;
    }
    res.contentType('application/x-x509-ca-cert');
    res.send(data);
    return;
  });
});


// - /domain
app.post('/domain', upload.single('csr'), (req, res) => {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body)
   res.send('thank you');
});
// - Methods
//     - POST
//         - Content-Type
//             - multipart/form-data
//         - Accepts
//             - Domain name
//                 - Have this be in post body
//             - CSR
//                 - Must be a file
//         - Returns
//             - fullchain.pem
//                 - A signed cert
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
