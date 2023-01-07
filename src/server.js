"use strict";

const express = require("express");
const { exec } = require("child_process");
const { v1: uuidv1 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const upload = multer();

// Constants
const PORT = 80;
const HOST = "0.0.0.0";

// App
const app = express();

// Hello world
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Returns CA.pem
app.get("/ca", (req, res) => {
  fs.readFile("/app/data/ca/CA.pem", "ascii", (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      res.send("Sorry, try again later");
      return;
    }
    res.contentType("application/x-x509-ca-cert");
    res.send(data);
    return;
  });
});

// - /domain
app.post("/domain", upload.single("csr"), (req, res) => {
  try {
    console.log({ headers: JSON.stringify(req.headers) });
    console.log({ file: req.file, body: req.body });
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    // Generate unique folder name
    const outputId = uuidv1();
    const outputPath = `/app/data/domain/${outputId}`;
    const outputPathCsr = `${outputPath}/child.csr`;
    // Create folder
    fs.mkdirSync(outputPath);

    // Some validation
    if (undefined === req.body || undefined === req.body.domain) {
      throw Error(`Missing or invalid domain`);
    }
    if (undefined === req.file || undefined === req.file.buffer) {
      throw Error(`Missing or invalid CSR file`);
    }
    // Extract request params and file
    const domain = req.body.domain;
    const csrData = req.file.buffer;
    // Write request uploaded CSR file to folder
    fs.writeFileSync(outputPathCsr, csrData);
    // Run openssl script and return signed certificate
    exec(
      `sh /app/src/scripts/sign.sh ${domain} ${outputPath}`,
      (error, stdout, stderr) => {
        if (null !== error) {
          throw Error(error.message);
        }
        res.contentType("application/x-x509-ca-cert");
        res.send(stdout);
        return;
      }
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    res.send("Sorry, try again later");
    return;
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
