const express = require('express');

const CoordinatesRoutes = require('./coordinates');

const Router = express.Router();

Router.use('/places', CoordinatesRoutes);

module.exports = Router;
