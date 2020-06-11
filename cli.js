#!/usr/bin/env node
const express = require("express");
const request = require("request-promise");
const bodyParser = require("body-parser");
const usage = require("./help");
const opts = require("./params");

if (typeof opts.help === "object") {
  usage();
  return -1;
}

if (!opts.to) {
  console.log(
    "You should provide either the --to (-t) param or define an XPROXY_TO environment variable."
  );
  return -1;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const reqBody = {
    method: req.method,
    uri: opts.to + req.path,
    json: true,
  };

  if (req.headers.authorization) {
    reqBody.headers = {
      authorization: req.headers.authorization,
    };
  }

  if (req.body) {
    reqBody.body = req.body;
  }

  console.log("Request: ", reqBody);

  try {
    const response = await request(reqBody);
    console.log("Response:", response);
    res.json(response);
  } catch (err) {
    const respError = err && err.response ? err.response : err;
    console.log("Response Error:", respError);
    res.status(err.statusCode);
    res.json(respError);
  }
});

app.listen(opts.port, () =>
  console.log(`Proxing port ${opts.port} to ${opts.to}`)
);
