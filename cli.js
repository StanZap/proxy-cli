#!/usr/bin/env node

const express = require("express");
const request = require("request-promise");
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const host = process.env.REMOTE_HOST || "https://localhost";
const port = process.env.PORT || 8002;

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

app.listen(port, () => console.log(`Proxing port ${port} to ${host}`));
