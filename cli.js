#!/usr/bin/env node
const commandLineArgs = require("command-line-args");
const express = require("express");
const request = require("request-promise");
const bodyParser = require("body-parser");
const usage = require("./help");

// Check params first
const optionDefinitions = [
  {
    name: "to",
    alias: "t",
    type: String,
    multiple: false,
    defaultOption: true,
    defaultValue: process.env.XPROXY_TO,
  },

  {
    name: "port",
    alias: "p",
    type: String,
    multiple: false,
    defaultValue: process.env.XPROXY_PORT || "8002",
  },
  {
    name: "help",
    alias: "h",
  },
];

const opts = commandLineArgs(optionDefinitions);

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
    uri: host + req.path,
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
