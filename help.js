module.exports = function () {
  const commandLineUsage = require("command-line-usage");

  const sections = [
    {
      header: "Simple API proxy server",
      content: "Create a proxy to your remote api server.",
    },
    {
      header: "Options",
      optionList: [
        {
          name: "to",
          alias: "t",
          type: String,
          description:
            "The host to be proxied. You can use the XPROXY_TO env variable instead if needed.",
        },
        {
          name: "port",
          alias: "p",
          type: String,
          description:
            "The local port to run the proxy server. You can use the XPROXY_PORT env variable instead if needed.",
        },
        {
          name: "help",
          alias: "h",
          description: "Prints this help message",
        },
      ],
    },
  ];

  const usage = commandLineUsage(sections);
  console.log(usage);
};
