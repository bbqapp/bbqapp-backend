"use strict";  // eslint-disable-line

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  location: {
    type: {type: String, required: true},
    coordinates: {type: [Number], index: {type: '2dsphere', sparse: true},
                  required: true}
  },
  tags: {type: [String], default: []}
}, {collection: 'places'});

module.exports = mongoose.model('Place', PlaceSchema);
