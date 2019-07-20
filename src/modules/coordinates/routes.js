const express = require('express');
const { multer } = require('../../lib');

const Controllers = require('./controllers');

const Router = express.Router();

Router.get('/', Controllers.getAllPlaces);
Router.post('/', multer.single('file'), Controllers.uploadPlace);
Router.get('/:name', Controllers.getOnePlace);

module.exports = Router;
