const commandLineArgs = require("command-line-args");

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

module.exports = opts;
