const Express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const express = routes => {
  const app = Express();

  app.use(cors());
  app.use(helmet());
  app.use(Express.json({ limit: "50mb" }));
  app.use(Express.urlencoded({ extended: false }));

  app.use("/v1", routes);

  return app;
};

module.exports = express;
