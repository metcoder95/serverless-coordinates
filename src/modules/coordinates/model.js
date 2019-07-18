const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// Schema to Validate if we store the data locally
const CoordinatesJoiSchema = Joi.object().keys({
  name: Joi.string().required(),
  lat: Joi.number().required(),
  lan: Joi.number().required(),
  notes: Joi.array().items(Joi.object())
});

// Mongoose Schema to save data into MongoDB
const Schema = mongoose.Schema;
const CoordinatesSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lan: {
      type: Number,
      required: true
    },
    notes: []
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Coordinates', CoordinatesSchema);

module.exports = {
  validationSchema: CoordinatesJoiSchema,
  model
};
