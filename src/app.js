const serverless = require("serverless-http");

const { express } = require("./lib");
const appRoutes = require("./modules");

const app = express(appRoutes);

module.exports = serverless(app);
