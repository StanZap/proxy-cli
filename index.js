const express = require("express");
const request = require("request-promise");
// const { createProxyMiddleware } = require("http-proxy-middleware");
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const host = process.env.REMOTE_HOST || "https://localhost";

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

  console.log(reqBody);

  try {
    const response = await request(reqBody);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode);
    res.json(err && err.response ? err.response : err);
  }
});

// app.use(
//   createProxyMiddleware({
//     target: "https://qctest.phpfox.us",
//     changeOrigin: true,
//   })
// );

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
