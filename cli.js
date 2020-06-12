#!/usr/bin/env node
const express = require("express");
const axios = require("axios");
const cors = require("cors");
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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  console.log(`\n\n============ REQUEST: ${req.method} ${req.url}`);
  const reqBody = {
    method: req.method.toLowerCase(),
    url: opts.to + req.url,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  };

  if (req.headers.authorization) {
    reqBody.headers.authorization = req.headers.authorization;
  }

  if (req.body) {
    console.log("req.body", req.body);
    reqBody.data = req.body;
  }

  // console.log("Request: ...");
  console.log("\n==> Request: ", reqBody);

  try {
    const response = await axios(reqBody);
    console.log("\n==> Response Success: Code " + response.status);
    console.log(response.data ? response.data : "No response data");
    // res.set(response.headers);
    res.json(response.data);
    res.status(response.status);
  } catch (err) {
    const respError = err && err.response && err.response.data;
    //     ? err.response.data
    // console.log("\n==> Response Error: Code ", respError.response);
    console.log("\n", respError);
    // res.status(err.statusCode);
    res.send(err);
  }
});

app.listen(opts.port, () =>
  console.log(`Proxing port ${opts.port} to ${opts.to}`)
);
